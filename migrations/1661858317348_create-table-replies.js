/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: 'FALSE',
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('replies', 'fk_replies', {
    foreignKeys: [
      {
        columns: 'comment_id',
        references: 'comments(id)',
        referencesConstraintName: 'fk_replies.comment_id_comments.id',
        onDelete: 'CASCADE',
      },
      {
        columns: 'owner',
        references: 'users(id)',
        referencesConstraintName: 'fk_replies.owner_users.id',
        onDelete: 'CASCADE',
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
