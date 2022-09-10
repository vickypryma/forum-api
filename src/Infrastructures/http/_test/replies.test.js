const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  beforeAll(async () => {
    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding',
      },
    });

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'vicky',
        password: 'secret',
        fullname: 'Vicky',
      },
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const _loginUser = async (server, { username = 'dicoding' }) => {
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username,
        password: 'secret',
      },
    });

    const { data: { accessToken } } = JSON.parse(response.payload);

    return accessToken;
  };

  const _createThread = async (server, accessToken) => {
    const requestPayload = {
      title: 'dicoding',
      body: 'dicoding indonesia',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { data: { addedThread: { id } } } = JSON.parse(response.payload);

    return id;
  };

  const _createComment = async (server, threadId, accessToken) => {
    const requestPayload = {
      content: 'komentar',
    };

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { data: { addedComment: { id } } } = JSON.parse(response.payload);

    return id;
  };

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when request without authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when comment or thread not found', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/not-found/replies',
        payload: { content: 'balasan' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});
      const threadId = await _createThread(server, accessToken);
      const commentId = await _createComment(server, threadId, accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when payload not meet data type specification', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});
      const threadId = await _createThread(server, accessToken);
      const commentId = await _createComment(server, threadId, accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 123 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena tipe data tidak sesuai');
    });

    it('should response 201 and added reply', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});
      const threadId = await _createThread(server, accessToken);
      const commentId = await _createComment(server, threadId, accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'balasan' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId/replies/{replyId}', () => {
    it('should response 401 when request without authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when data not found', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 403 when user is not replies owner', async () => {
      const server = await createServer(container);

      const ownerToken = await _loginUser(server, {});
      const guestToken = await _loginUser(server, { username: 'vicky' });

      const threadId = await _createThread(server, ownerToken);
      const commentId = await _createComment(server, threadId, ownerToken);

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'balasan' },
        headers: { Authorization: `Bearer ${ownerToken}` },
      });

      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${guestToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses balasan ini');
    });

    it('should response 200 with status "success"', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});

      const threadId = await _createThread(server, accessToken);
      const commentId = await _createComment(server, threadId, accessToken);

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'balasan' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
