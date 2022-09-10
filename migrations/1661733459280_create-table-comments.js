/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
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

  pgm.addConstraint('comments', 'fk_comments', {
    foreignKeys: [
      {
        columns: 'thread_id',
        references: 'threads(id)',
        referencesConstraintName: 'fk_comments.thread_id_threads.id',
        onDelete: 'CASCADE',
      },
      {
        columns: 'owner',
        references: 'users(id)',
        referencesConstraintName: 'fk_comments.owner_users.id',
        onDelete: 'CASCADE',
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
