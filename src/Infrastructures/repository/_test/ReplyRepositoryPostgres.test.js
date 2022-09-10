const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should add reply to database', async () => {
      const addReply = new AddReply({
        content: 'balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(replies).toHaveLength(1);
    });

    it('should return AddedReply correctly', async () => {
      const addReply = new AddReply({
        content: 'balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should get replies by comment_id from database', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'ini balasan',
        commentId: 'comment-123',
        owner: 'user-123',
        date: new Date('2022=09-02 12:00'),
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      expect(replies).toHaveLength(1);
      expect(replies[0]).toBeInstanceOf(DetailReply);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].content).toEqual('ini balasan');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].date).toEqual(new Date('2022=09-02 12:00'));
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should get replies by array of comment_id from database', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'ini balasan',
        commentId: 'comment-123',
        owner: 'user-123',
        date: new Date('2022=09-02 12:00'),
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(['comment-123']);

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].content).toEqual('ini balasan');
      expect(replies[0].comment_id).toEqual('comment-123');
      expect(replies[0].owner).toEqual('user-123');
      expect(replies[0].date).toEqual(new Date('2022=09-02 12:00'));
      expect(replies[0].username).toEqual('dicoding');
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when comment or reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReplyById('not-found', 'comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should update is_delete column to be TRUE', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReplyById('reply-123', 'comment-123');

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('not-found', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not replies owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'not-owner'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is replies owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });
});
