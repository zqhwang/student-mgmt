exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('teachers', function(table) {
      table.increments('id').primary();
      table
        .string('email')
        .notNullable()
        .unique();
    }),
    knex.schema.createTable('students', function(table) {
      table.increments('id').primary();
      table
        .string('email')
        .notNullable()
        .unique();
      table
        .boolean('suspend')
        .notNullable()
        .defaultTo(0);
    }),
    knex.schema.createTable('teachers_students', function(table) {
      table
        .integer('student_id', 10)
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE');
      table
        .integer('teacher_id', 10)
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('teachers')
        .onDelete('CASCADE');
      table.primary(['student_id', 'teacher_id']);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('teachers_students'),
    knex.schema.dropTable('teachers'),
    knex.schema.dropTable('students')
  ]);
};
