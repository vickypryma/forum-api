const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute('comment-123', 'user-123', 'thread-123');

    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith('comment-123', 'thread-123');
  });
});
