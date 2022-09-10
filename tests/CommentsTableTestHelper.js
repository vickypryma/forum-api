/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  addComment: async ({
    id = 'comment-123',
    content = 'dicoding',
    threadId = 'thread-123',
    owner = 'user-123',
    date = new Date(),
  }) => {
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, DEFAULT, $5)',
      values: [id, content, threadId, owner, date],
    };

    await pool.query(query);
  },

  findCommentById: async (id) => {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  cleanTable: async () => {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
