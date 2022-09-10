const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should add comment to database', async () => {
      const addComment = new AddComment({
        content: 'dicoding',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(addComment);

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return AddedComment correctly', async () => {
      const addComment = new AddComment({
        content: 'dicoding',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should get comments by thread_id from database', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'ini komentar',
        threadId: 'thread-123',
        owner: 'user-123',
        date: new Date('2022=09-02 12:00'),
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(1);
      expect(comments[0]).toBeInstanceOf(DetailComment);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].content).toEqual('ini komentar');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].date).toEqual(new Date('2022=09-02 12:00'));
      expect(comments[0].likeCount).toEqual(0);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when data not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteCommentById('thread-123', 'comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should update is_delete column to be TRUE', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById('comment-123', 'thread-123');

      const comments = await CommentsTableTestHelper.findCommentById('comment-123');

      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when data not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not comments owner', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'not-owner'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is comments owner', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentValidity function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentValidity('not-found', 'thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentValidity('comment-123', 'thread-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
});
