const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'komentar',
      threadId: 'thread-123',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      content: 'komentar',
      threadId: 'thread-123',
      userId: 123,
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    const payload = {
      content: 'komentar',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const addComment = new AddComment(payload);

    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.userId).toEqual(payload.userId);
  });
});
