const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'balasan',
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'balasan',
      owner: 'user-123',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentValidity = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReply({
        id: 'reply-123',
        content: 'balasan',
        owner: 'user-123',
      })));

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockCommentRepository.verifyCommentValidity).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply(useCasePayload));
  });
});
