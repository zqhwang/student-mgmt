var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var studentsQueries = require('../db/students_queries');
var teachersQueries = require('../db/teachers_queries');
var dbTransaction = require('../db/transaction');

/**
 * POST /api/register
 */
router.post('/register', function(req, res, next) {
  if (!req.is('application/json')) {
    return res
      .status(415)
      .json({ message: 'request Content-Type must be json' });
  }

  if (!req.body.teacher) {
    return res.status(400).json({ message: 'teacher not provided' });
  }
  var teacherEmail = req.body.teacher;

  if (!req.body.students) {
    return res.status(400).json({ message: 'students not provided' });
  }
  var studentEmails = req.body.students;

  teachersQueries
    .getTeacher(teacherEmail)
    .then(function(teacherResult) {
      if (teacherResult.length === 0) {
        return Promise.reject('teacher not found');
      } else {
        var teacherId = teacherResult[0].id;

        return Promise.all([
          teacherId,
          studentsQueries.getStudents(studentEmails),
          studentsQueries.getStudentsToTeacher(studentEmails, teacherEmail)
        ]);
      }
    })
    .spread(function(teacherId, registeredStudents, teacherStudents) {
      var newStudentEmails = studentEmails.filter(function(se) {
        return !registeredStudents.some(function(rs) {
          return rs.email === se;
        });
      });

      var studentIds = registeredStudents
        .filter(function(rs) {
          return !teacherStudents.some(function(ts) {
            return ts.email === rs.email;
          });
        })
        .map(function(rs) {
          return rs.id;
        });

      return dbTransaction.beginTransaction(function(txn) {
        return studentsQueries
          .registerStudents(newStudentEmails, txn)
          .then(function() {
            return studentsQueries.getStudents(newStudentEmails, txn);
          })
          .then(function(newStudents) {
            var newStudentIds = newStudents.map(function(s) {
              return s.id;
            });

            var allStudentsId = studentIds.concat(newStudentIds);

            return teachersQueries.addStudentsToTeacher(
              teacherId,
              allStudentsId,
              txn
            );
          })
          .then(txn.commit);
      });
    })
    .then(function() {
      res.status(204).end();
    })
    .catch(function(reason) {
      if (reason === 'teacher not found') {
        res.status(404).json({ message: reason });
      } else {
        console.error(reason);
        res.status(500).json({ message: 'server error' });
      }
    });
});

/**
 * GET /api/commonstudents
 */
router.get('/commonstudents', function(req, res, next) {
  var teacherEmails = req.query.teacher;
  if (!teacherEmails) {
    return res.status(400).json({ message: 'teacher not provided' });
  }

  if (typeof teacherEmails === 'string') {
    studentsQueries
      .getAllStudentsToTeacher(teacherEmails)
      .then(function(queryResult) {
        var result = queryResult.map(function(s) {
          return s.email;
        });

        res.json({ students: result });
      })
      .catch(function(reason) {
        console.error(reason);
        res.status(500).json({ message: 'server error' });
      });
  } else {
    studentsQueries
      .getCommonStudentsToTeachers(teacherEmails)
      .then(function(queryResult) {
        var result = queryResult.map(function(s) {
          return s.email;
        });

        res.json({ students: result });
      })
      .catch(function(reason) {
        console.error(reason);
        res.status(500).json({ message: 'server error' });
      });
  }
});

/**
 * POST /api/suspend
 */
router.post('/suspend', function(req, res, next) {
  if (!req.is('application/json')) {
    return res
      .status(415)
      .json({ message: 'request Content-Type must be json' });
  }

  if (!req.body.student) {
    return res.status(400).json({ message: 'student not provided' });
  }
  var studentEmail = req.body.student;

  studentsQueries
    .getStudent(studentEmail)
    .then(function(queryResult) {
      if (queryResult.length === 0) {
        return Promise.reject('student not found');
      } else {
        return studentsQueries.suspendStudent(studentEmail);
      }
    })
    .then(function() {
      res.status(204).end();
    })
    .catch(function(reason) {
      if (reason === 'student not found') {
        res.status(404).json({ message: reason });
      } else {
        console.error(reason);
        res.status(500).json({ message: 'server error' });
      }
    });
});

/**
 * POST /api/retrievefornotifications
 */
router.post('/retrievefornotifications', function(req, res, next) {
  if (!req.is('application/json')) {
    return res
      .status(415)
      .json({ message: 'request Content-Type must be json' });
  }

  if (!req.body.teacher) {
    return res.status(400).json({ message: 'teacher not provided' });
  }
  var teacherEmail = req.body.teacher;

  if (!req.body.notification) {
    return res.status(400).json({ message: 'notification not provided' });
  }
  var notification = req.body.notification;

  var studentEmails = notification.match(/@\S+@\S+\.\S+/g) || [];
  studentEmails = studentEmails.map(function(em) {
    return em.substring(1);
  });

  studentsQueries
    .getNonSuspendedStudents(studentEmails)
    .then(function(result) {
      var recipientsList1 = result.map(function(r) {
        return r.email;
      });

      return Promise.all([
        recipientsList1,
        studentsQueries.getNonSuspendedStudentsToTeacher(
          teacherEmail,
          recipientsList1
        )
      ]);
    })
    .spread(function(recipientsList1, result) {
      var recipientsList2 = result.map(function(r) {
        return r.email;
      });

      var allRecipientsList = recipientsList1.concat(recipientsList2);

      res.json({ recipients: allRecipientsList });
    })
    .catch(function(reason) {
      console.error(reason);
      res.status(500).json({ message: 'server error' });
    });
});

module.exports = router;
