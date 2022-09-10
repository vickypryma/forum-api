const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
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
    await CommentLikesTableTestHelper.cleanTable();
  });

  describe('verifyCommentLiked function', () => {
    it('should verify comment liked from database', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({ commentId: 'comment-123', userId: 'user-123' });
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await commentLikeRepository.verifyCommentLiked('comment-123', 'user-123');

      // Assert
      expect(isLiked).toBeTruthy();
    });
  });

  describe('likeComment function', () => {
    it('should add comment like to database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepository.likeComment('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findCommentLikeById('comment-like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('unlikeComment function', () => {
    it('should delete comment like from database', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      await commentLikeRepository.unlikeComment('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findCommentLikeById('comment-like-123');
      expect(likes).toHaveLength(0);
    });
  });
});
