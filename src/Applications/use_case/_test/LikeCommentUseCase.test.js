const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.verifyCommentValidity = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyCommentLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(0));
    mockCommentLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute('comment-123', 'thread-123', 'user-123');

    // Assert
    expect(mockCommentRepository.verifyCommentValidity).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentLikeRepository.verifyCommentLiked).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.likeComment).toBeCalledWith('comment-123', 'user-123');
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockCommentRepository.verifyCommentValidity = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyCommentLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentLikeRepository.unlikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute('comment-123', 'thread-123', 'user-123');

    // Assert
    expect(mockCommentRepository.verifyCommentValidity).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentLikeRepository.verifyCommentLiked).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.unlikeComment).toBeCalledWith('comment-123', 'user-123');
  });
});
