const AddReply = require('../AddReply');

describe('AddReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'balasan',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      content: 'balasan',
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 123,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply object correctly', () => {
    const payload = {
      content: 'balasan',
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const addReply = new AddReply(payload);

    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.threadId).toEqual(payload.threadId);
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.userId).toEqual(payload.userId);
  });
});
