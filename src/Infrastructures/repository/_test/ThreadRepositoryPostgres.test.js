const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread functiond', () => {
    it('should add thread to database', async () => {
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'dicoding indonesia',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread, 'user-123');

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return AddedThread correctly', async () => {
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'dicoding indonesia',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(addThread, 'user-123');

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return DetailThread when thread found', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread',
        body: 'ini thread',
        owner: 'user-123',
        date: new Date('2022-09-01 12:00'),
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread).toBeInstanceOf(DetailThread);
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('thread');
      expect(thread.body).toEqual('ini thread');
      expect(thread.username).toEqual('dicoding');
      expect(thread.date).toEqual(new Date('2022-09-01 12:00'));
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadValidity('not-found'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadValidity('thread-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
});
