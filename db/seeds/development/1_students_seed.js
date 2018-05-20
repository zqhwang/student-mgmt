exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return (
    knex('students')
      .del()
      .then(function() {
        // Inserts seed entries one by one
        return knex('students').insert({
          email: 'commonstudent1@gmail.com',
          suspend: 0
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'commonstudent2@gmail.com',
          suspend: 0
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'student_only_under_teacher_ken@gmail.com',
          suspend: 0
        });
      })
      //;
      .then(function() {
        return knex('students').insert({
          email: 'studentmary@gmail.com',
          suspend: 0
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'student_registered_to_teacher_mike@gmail.com',
          suspend: 0
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'studentbob@gmail.com',
          suspend: 0
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'suspended_student_under_teacher_nick@gmail.com',
          suspend: 1
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'studentagnes@gmail.com',
          suspend: 0
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'studentmiche@gmail.com',
          suspend: 0
        });
      })
      .then(function() {
        return knex('students').insert({
          email: 'suspended_student_under_teacher_peter@gmail.com',
          suspend: 1
        });
      })
  );
};
