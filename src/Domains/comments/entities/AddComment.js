class AddComment {
  constructor(payload) {
    this._validatePayload(payload);

    const { content, threadId, userId } = payload;

    this.content = content;
    this.threadId = threadId;
    this.userId = userId;
  }

  _validatePayload({ content, threadId, userId }) {
    if (!content || !threadId || !userId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
