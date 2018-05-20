var knex = require('./knex.js');
var Promise = require('bluebird');

function Teachers() {
  return knex('teachers');
}

function getTeacher(teacherEmail) {
  /**
   * SELECT * FROM `teachers` WHERE `email` = ? LIMIT 1;
   */
  return Teachers()
    .limit(1)
    .where('email', teacherEmail);
}

function addStudentsToTeacher(teacherId, studentIds, transaction = null) {
  /**
   * INSERT INTO `teachers_students` (`teacher_id`, `student_id`)
   * VALUES (?, ?), (?, ?), ... (?, ?);
   */
  var valuesToInsert = studentIds.map(function(s) {
    return { teacher_id: teacherId, student_id: s };
  });

  var queryPromise = knex.insert(valuesToInsert).into('teachers_students');

  if (transaction) {
    return queryPromise.transacting(transaction);
  } else {
    return queryPromise;
  }
}

module.exports = {
  getTeacher,
  addStudentsToTeacher
};
