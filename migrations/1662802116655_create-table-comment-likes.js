/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('comment_likes', 'unique_comment_id_and_user_id', 'UNIQUE(comment_id, user_id)');

  pgm.addConstraint('comment_likes', 'fk_comment_likes', {
    foreignKeys: [
      {
        columns: 'comment_id',
        references: 'comments(id)',
        referencesConstraintName: 'fk_comment_likes.comment_id_comments.id',
        onDelete: 'CASCADE',
      },
      {
        columns: 'user_id',
        references: 'users(id)',
        referencesConstraintName: 'fk_comment_likes.user_id_users.id',
        onDelete: 'CASCADE',
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
