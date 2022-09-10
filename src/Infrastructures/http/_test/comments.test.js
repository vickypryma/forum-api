const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
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

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when request without authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});

      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {
          content: 'dicoding',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});
      const threadId = await _createThread(server, accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when payload not meet data specification', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});
      const threadId = await _createThread(server, accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 123 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar karena tipe data tidak sesuai');
    });

    it('should response 201 and added comment', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});
      const threadId = await _createThread(server, accessToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'ini komentar' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when request without authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread or comment not found', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/xxx',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 403 when user not authorized', async () => {
      const server = await createServer(container);

      const dicodingAccessToken = await _loginUser(server, {});
      const vickyAccessToken = await _loginUser(server, { username: 'vicky' });
      const threadId = await _createThread(server, dicodingAccessToken);

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'ini komentar' },
        headers: { Authorization: `Bearer ${dicodingAccessToken}` },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${vickyAccessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses komentar ini');
    });

    it('should response 200 with status "success"', async () => {
      const server = await createServer(container);

      const accessToken = await _loginUser(server, {});
      const threadId = await _createThread(server, accessToken);

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'ini komentar' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
