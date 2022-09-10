class AddReply {
  constructor(payload) {
    this._validatePayload(payload);

    const {
      content,
      threadId,
      commentId,
      userId,
    } = payload;

    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.userId = userId;
  }

  _validatePayload({
    content,
    threadId,
    commentId,
    userId,
  }) {
    if (!content || !threadId || !commentId || !userId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
