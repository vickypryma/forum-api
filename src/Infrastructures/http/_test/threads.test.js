const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
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
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const _loginUser = async (server) => {
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
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

  describe('when POST /threads', () => {
    it('should response 401 when request without authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const server = await createServer(container);

      const requestPayload = {
        body: 'dicoding indonesia',
      };
      const accessToken = await _loginUser(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container);

      const requestPayload = {
        title: 123,
        body: 'dicoding indonesia',
      };
      const accessToken = await _loginUser(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena tipe data tidak sesuai');
    });

    it('should response 201 and added thread', async () => {
      const server = await createServer(container);

      const requestPayload = {
        title: 'dicoding',
        body: 'dicoding indonesia',
      };
      const accessToken = await _loginUser(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/{id}', () => {
    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 200 and thread detail', async () => {
      const server = await createServer(container);
      const accessToken = await _loginUser(server);
      const threadId = await _createThread(server, accessToken);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
