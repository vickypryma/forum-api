const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const id = `comment-${this._idGenerator()}`;
    const { content, threadId, userId } = addComment;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, DEFAULT, DEFAULT) RETURNING id, content, owner',
      values: [id, content, threadId, userId],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete
      FROM comments
      JOIN users ON users.id = comments.owner
      WHERE thread_id = $1
      ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => new DetailComment(comment));
  }

  async deleteCommentById(id, threadId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 AND thread_id = $2 RETURNING id',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const { owner } = result.rows[0];

    if (userId !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses komentar ini');
    }
  }

  async verifyCommentValidity(id, threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
