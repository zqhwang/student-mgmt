exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teachers_students')
    .del()
    .then(function() {
      var teacherken = knex('teachers')
        .select('id')
        .where({ email: 'teacherken@gmail.com' });

      var teacherjoe = knex('teachers')
        .select('id')
        .where({ email: 'teacherjoe@gmail.com' });

      var commonstudent1 = knex('students')
        .select('id')
        .where({ email: 'commonstudent1@gmail.com' });

      var commonstudent2 = knex('students')
        .select('id')
        .where({ email: 'commonstudent2@gmail.com' });

      var student_only_under_teacher_ken = knex('students')
        .select('id')
        .where({ email: 'student_only_under_teacher_ken@gmail.com' });

      //

      var teachermike = knex('teachers')
        .select('id')
        .where({ email: 'teachermike@gmail.com' });

      var studentmary = knex('students')
        .select('id')
        .where({ email: 'studentmary@gmail.com' });

      var student_registered_to_teacher_mike = knex('students')
        .select('id')
        .where({ email: 'student_registered_to_teacher_mike@gmail.com' });

      var teachernick = knex('teachers')
        .select('id')
        .where({ email: 'teachernick@gmail.com' });

      var studentbob = knex('students')
        .select('id')
        .where({ email: 'studentbob@gmail.com' });

      var suspended_student_under_teacher_nick = knex('students')
        .select('id')
        .where({ email: 'suspended_student_under_teacher_nick@gmail.com' });

      var teacherpeter = knex('teachers')
        .select('id')
        .where({ email: 'teacherpeter@gmail.com' });

      var studentagnes = knex('students')
        .select('id')
        .where({ email: 'studentagnes@gmail.com' });

      var studentmiche = knex('students')
        .select('id')
        .where({ email: 'studentmiche@gmail.com' });

      var suspended_student_under_teacher_peter = knex('students')
        .select('id')
        .where({ email: 'suspended_student_under_teacher_peter@gmail.com' });

      return Promise.all([
        teacherken,
        teacherjoe,
        commonstudent1,
        commonstudent2,
        student_only_under_teacher_ken,
        //
        teachermike,
        studentmary,
        student_registered_to_teacher_mike,
        teachernick,
        studentbob,
        suspended_student_under_teacher_nick,
        teacherpeter,
        studentagnes,
        studentmiche,
        suspended_student_under_teacher_peter
      ]);
    })
    .spread(function(
      teacherken,
      teacherjoe,
      commonstudent1,
      commonstudent2,
      student_only_under_teacher_ken,
      //
      teachermike,
      studentmary,
      student_registered_to_teacher_mike,
      teachernick,
      studentbob,
      suspended_student_under_teacher_nick,
      teacherpeter,
      studentagnes,
      studentmiche,
      suspended_student_under_teacher_peter
    ) {
      return Promise.all([
        knex('teachers_students').insert({
          teacher_id: teacherken[0].id,
          student_id: commonstudent1[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teacherken[0].id,
          student_id: commonstudent2[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teacherken[0].id,
          student_id: student_only_under_teacher_ken[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teacherjoe[0].id,
          student_id: commonstudent1[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teacherjoe[0].id,
          student_id: commonstudent2[0].id
        }),
        //
        knex('teachers_students').insert({
          teacher_id: teachermike[0].id,
          student_id: studentmary[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teachermike[0].id,
          student_id: student_registered_to_teacher_mike[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teachernick[0].id,
          student_id: studentbob[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teachernick[0].id,
          student_id: suspended_student_under_teacher_nick[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teacherpeter[0].id,
          student_id: studentagnes[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teacherpeter[0].id,
          student_id: studentmiche[0].id
        }),
        knex('teachers_students').insert({
          teacher_id: teacherpeter[0].id,
          student_id: suspended_student_under_teacher_peter[0].id
        })
      ]);
    });
};
