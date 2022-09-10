/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  addReply: async ({
    id = 'reply-123',
    content = 'dicoding',
    commentId = 'comment-123',
    owner = 'user-123',
    date = new Date(),
  }) => {
    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, DEFAULT, $5)',
      values: [id, content, commentId, owner, date],
    };

    await pool.query(query);
  },

  findReplyById: async (id) => {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  cleanTable: async () => {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
