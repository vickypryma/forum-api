const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CommentLikesTableTestHelper = {
  addCommentLike: async ({
    id = 'comment-like-123',
    commentId = 'comment-123',
    userId = 'user-123',
  }) => {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await pool.query(query);
  },

  findCommentLikeById: async (id) => {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  cleanTable: async () => {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
