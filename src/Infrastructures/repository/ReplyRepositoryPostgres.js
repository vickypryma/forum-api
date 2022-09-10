const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const id = `reply-${this._idGenerator()}`;
    const { content, commentId, userId } = addReply;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, DEFAULT, DEFAULT) RETURNING id, content, owner',
      values: [id, content, commentId, userId],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete
      FROM replies
      JOIN users ON users.id = replies.owner
      WHERE comment_id = $1
      ORDER BY date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((reply) => new DetailReply(reply));
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: `SELECT replies.*, users.username
      FROM replies
      JOIN users ON users.id = replies.owner
      WHERE comment_id = ANY($1::text[])
      ORDER BY date ASC`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteReplyById(id, commentId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1 AND comment_id = $2 RETURNING id',
      values: [id, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    const { owner } = result.rows[0];

    if (userId !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses balasan ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
