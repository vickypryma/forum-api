const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const userId = 'user-123';

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentValidity = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteReplyUseCase.execute(replyId, commentId, threadId, userId);
    expect(mockCommentRepository.verifyCommentValidity).toBeCalledWith(commentId, threadId);
    expect(mockReplyRepository.verifyReplyOwner(replyId, userId));
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(replyId, commentId);
  });
});
