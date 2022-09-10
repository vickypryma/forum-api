const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'dicoding',
      threadId: 'thread-123',
      userId: 'user-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'dicoding',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadValidity = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-123',
      })));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadValidity).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(useCasePayload));
  });
});
