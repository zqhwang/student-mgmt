exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teachers')
    .del()
    .then(function() {
      // Inserts seed entries one by one
      return knex('teachers').insert({ email: 'teacherken@gmail.com' });
    })
    .then(function() {
      return knex('teachers').insert({ email: 'teacherjoe@gmail.com' });
    })
    .then(function() {
      return knex('teachers').insert({ email: 'teachermike@gmail.com' });
    })
    .then(function() {
      return knex('teachers').insert({ email: 'teachernick@gmail.com' });
    })
    .then(function() {
      return knex('teachers').insert({ email: 'teacherpeter@gmail.com' });
    });
};
