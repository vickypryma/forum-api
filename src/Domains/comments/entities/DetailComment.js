/* eslint-disable camelcase */
class DetailComment {
  constructor(payload) {
    this._validatePayload(payload);

    const {
      id, username, date, content, is_delete, like_count,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.likeCount = Number(like_count);
  }

  _validatePayload({
    id, username, date, content, is_delete, like_count,
  }) {
    if (!id || !username || !date || !content || is_delete === undefined || !like_count) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || !(date instanceof Date) || typeof content !== 'string' || typeof is_delete !== 'boolean' || typeof like_count !== 'string') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
