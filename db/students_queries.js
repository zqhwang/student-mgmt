var knex = require('./knex.js');
var Promise = require('bluebird');

function Students() {
  return knex('students');
}

function getAllStudentsToTeacher(teacherEmail) {
  /**
   * SELECT `students`.* FROM `students`
   * INNER JOIN `teachers_students` ON `students`.`id` = `teachers_students`.`student_id`
   * INNER JOIN `teachers` ON `teachers_students`.`teacher_id` = `teachers`.`id`
   * WHERE `teachers`.`email` = ?;
   */
  return Students()
    .select('students.*')
    .innerJoin(
      'teachers_students',
      'students.id',
      'teachers_students.student_id'
    )
    .innerJoin('teachers', 'teachers_students.teacher_id', 'teachers.id')
    .where('teachers.email', teacherEmail);
}

function getCommonStudentsToTeachers(teacherEmails) {
  /**
   * SELECT `students`.`email`, count(`students`.`email`) AS `count` FROM `students`
   * INNER JOIN `teachers_students` ON `students`.`id` = `teachers_students`.`student_id`
   * INNER JOIN `teachers` ON `teachers_students`.`teacher_id` = `teachers`.`id`
   * WHERE `teachers`.`email` IN (?)
   * GROUP BY `students`.`email`
   * HAVING `count` > 1;
   */
  return Students()
    .select('students.*')
    .count('students.email as count')
    .innerJoin(
      'teachers_students',
      'students.id',
      'teachers_students.student_id'
    )
    .innerJoin('teachers', 'teachers_students.teacher_id', 'teachers.id')
    .whereIn('teachers.email', teacherEmails)
    .groupBy('students.email')
    .having('count', '>', 1);
}

function getStudent(studentEmail) {
  /**
   * SELECT * FROM `students` WHERE `email` = ? LIMIT 1;
   */
  return Students()
    .limit(1)
    .where('email', studentEmail);
}

function getStudents(studentEmails, transaction = null) {
  /**
   * SELECT * FROM `students` WHERE `email` IN (?);
   */
  var queryPromise = Students().whereIn('email', studentEmails);

  if (transaction) {
    return queryPromise.transacting(transaction);
  } else {
    return queryPromise;
  }
}

function getNonSuspendedStudents(studentEmails) {
  /**
   * SELECT * FROM `students` WHERE `email` IN (?) AND `suspend` = 0;
   */
  return Students()
    .whereIn('email', studentEmails)
    .where({ suspend: 0 });
}

function getStudentsToTeacher(studentEmails, teacherEmail) {
  /**
   * SELECT `students`.* FROM `students`
   * INNER JOIN `teachers_students` ON `students`.`id` = `teachers_students`.`student_id`
   * INNER JOIN `teachers` ON `teachers_students`.`teacher_id` = `teachers`.`id`
   * WHERE `students`.`email` IN (?) AND `teachers`.`email` = ?;
   */
  return Students()
    .select('students.*')
    .innerJoin(
      'teachers_students',
      'students.id',
      'teachers_students.student_id'
    )
    .innerJoin('teachers', 'teachers_students.teacher_id', 'teachers.id')
    .whereIn('students.email', studentEmails)
    .where('teachers.email', teacherEmail);
}

function getNonSuspendedStudentsToTeacher(teacherEmail, excludeStudentEmails) {
  /**
   * SELECT `students`.* FROM `students`
   * INNER JOIN `teachers_students` ON `students`.`id` = `teachers_students`.`student_id`
   * INNER JOIN `teachers` ON `teachers_students`.`teacher_id` = `teachers`.`id`
   * WHERE `students`.`email` IN (?) AND `teachers`.`email` = ?;
   */
  return Students()
    .select('students.*')
    .innerJoin(
      'teachers_students',
      'students.id',
      'teachers_students.student_id'
    )
    .innerJoin('teachers', 'teachers_students.teacher_id', 'teachers.id')
    .whereNotIn('students.email', excludeStudentEmails)
    .where('students.suspend', 0)
    .where('teachers.email', teacherEmail);
}

function suspendStudent(studentEmail) {
  /**
   * UPDATE `students` SET `suspend` = 1 WHERE `email` = ?;
   */
  return Students()
    .where('email', studentEmail)
    .update({ suspend: 1 });
}

function registerStudents(studentEmails, transaction = null) {
  var valuesToInsert = studentEmails.map(function(s) {
    return { email: s };
  });

  /**
   * INSERT INTO `students` (`email`) VALUES (?), (?), ... (?);
   */
  var queryPromise = Students().insert(valuesToInsert);
  if (transaction) {
    return queryPromise.transacting(transaction);
  } else {
    return queryPromise;
  }
}

module.exports = {
  getAllStudentsToTeacher,
  getCommonStudentsToTeachers,
  getStudent,
  getStudents,
  getNonSuspendedStudents,
  getStudentsToTeacher,
  getNonSuspendedStudentsToTeacher,
  suspendStudent,
  registerStudents
};
