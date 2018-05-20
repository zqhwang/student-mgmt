process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var knex = require('../db/knex');

var should = chai.should();

global.Promise = require('bluebird');

chai.use(chaiHttp);

describe('POST /api/register', function() {
  beforeEach(function(done) {
    knex.migrate
      .rollback()
      .then(function() {
        return knex.migrate.latest();
      })
      .then(function() {
        return knex.seed.run();
      })
      .then(function() {
        done();
      });
  });

  afterEach(function(done) {
    knex.migrate.rollback().then(function() {
      done();
    });
  });

  it('should register multiple students to a teacher', function(done) {
    this.timeout(5000);
    /**
     * 'studentjon@gmail.com' and 'studenthon@gmail.com' should register
     * to 'teacherken@gmail.com'
     */
    chai
      .request(server)
      .post('/api/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com', 'studenthon@gmail.com']
      })
      .then(function(res) {
        res.should.have.status(204);
      })
      .then(function() {
        /**
         * SELECT `students`.email` FROM `students` INNER JOIN `teachers_students`
         * ON `students`.`id` = `teachers_students`.`student_id`
         * INNER JOIN `teachers` ON `teachers`.`id` = `teachers_students`.`teacher_id`
         * WHERE `teachers`.`email` = 'teacherken@gmail.com' AND
         * `students`.`email` IN ('studentjon@gmail.com', 'studenthon@gmail.com');
         */
        return knex('students')
          .select('students.email')
          .innerJoin(
            'teachers_students',
            'students.id',
            'teachers_students.student_id'
          )
          .innerJoin('teachers', 'teachers_students.teacher_id', 'teachers.id')
          .where('teachers.email', 'teacherken@gmail.com')
          .whereIn('students.email', [
            'studentjon@gmail.com',
            'studenthon@gmail.com'
          ]);
      })
      .then(function(result) {
        result.should.be.an('array');
        result.should.have.lengthOf(2);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('should register students already registered to another teacher', function(done) {
    this.timeout(5000);
    /**
     * 'student_under_teacher_mike@gmail.com' is already registered to
     * 'teachermike@gmail.com'
     */
    chai
      .request(server)
      .post('/api/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: [
          'studentjon@gmail.com',
          'student_registered_to_teacher_mike@gmail.com'
        ]
      })
      .then(function(res) {
        res.should.have.status(204);
      })
      .then(function() {
        /**
         * SELECT `students`.email` FROM `students` INNER JOIN `teachers_students`
         * ON `students`.`id` = `teachers_students`.`student_id`
         * INNER JOIN `teachers` ON `teachers`.`id` = `teachers_students`.`teacher_id`
         * WHERE `teachers`.`email` = 'teacherken@gmail.com' AND
         * `students`.`email` IN ('studentjon@gmail.com', 'student_registered_to_teacher_mike@gmail.com');
         */
        return knex('students')
          .select('students.email')
          .innerJoin(
            'teachers_students',
            'students.id',
            'teachers_students.student_id'
          )
          .innerJoin('teachers', 'teachers_students.teacher_id', 'teachers.id')
          .where('teachers.email', 'teacherken@gmail.com')
          .whereIn('students.email', [
            'studentjon@gmail.com',
            'student_registered_to_teacher_mike@gmail.com'
          ]);
      })
      .then(function(result) {
        result.should.be.an('array');
        result.should.have.lengthOf(2);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
});

describe('GET /api/commonstudents', function() {
  beforeEach(function(done) {
    knex.migrate
      .rollback()
      .then(function() {
        return knex.migrate.latest();
      })
      .then(function() {
        return knex.seed.run();
      })
      .then(function() {
        done();
      });
  });

  afterEach(function(done) {
    knex.migrate.rollback().then(function() {
      done();
    });
  });

  it('should retrieve a list of students given teacher', function(done) {
    /**
     * 'commonstudent1@gmail.com', 'commonstudent2@gmail.com' and
     * 'student_only_under_teacher_ken@gmail.com' are registered to 'teacherken@gmail.com'
     */
    chai
      .request(server)
      .get('/api/commonstudents')
      .query({ teacher: 'teacherken@gmail.com' })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('students');
        res.body.students.should.be.an('array');
        res.body.students.should.have.lengthOf(3);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('should retrieve a list of students common to a given list of teachers', function(done) {
    /*
     * 'commonstudent1@gmail.com' and 'commonstudent2@gmail.com' are registered
     * to 'teacherjoe@gmail.com'
     *
     * 'commonstudent1@gmail.com', 'commonstudent2@gmail.com' and
     * 'student_only_under_teacher_ken@gmail.com' are registered to 'teacherken@gmail.com'
     */
    chai
      .request(server)
      .get('/api/commonstudents')
      .query({ teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'] })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('students');
        res.body.students.should.be.an('array');
        res.body.students.should.not.include(
          'student_only_under_teacher_ken@gmail.com'
        );
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
});

describe('POST /api/suspend', function() {
  beforeEach(function(done) {
    knex.migrate
      .rollback()
      .then(function() {
        return knex.migrate.latest();
      })
      .then(function() {
        return knex.seed.run();
      })
      .then(function() {
        done();
      });
  });

  afterEach(function(done) {
    knex.migrate.rollback().then(function() {
      done();
    });
  });

  it('should suspend the student', function(done) {
    /**
     * 'studentmary@gmail.com' initial `suspend` = 0, should be 1 after the request
     */
    chai
      .request(server)
      .post('/api/suspend')
      .send({ student: 'studentmary@gmail.com' })
      .then(function(res) {
        res.should.have.status(204);
      })
      .then(function() {
        /**
         * SELECT `suspend` FROM `students` WHERE `email` = 'studentmary@gmail.com';
         */
        return knex('students')
          .select('suspend')
          .where('email', 'studentmary@gmail.com');
      })
      .then(function(result) {
        result.should.be.an('array');
        result.should.have.lengthOf(1);
        result[0].should.have.property('suspend');
        result[0].suspend.should.equal(1);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
});

describe('POST /api/retrievefornotifications', function() {
  beforeEach(function(done) {
    knex.migrate
      .rollback()
      .then(function() {
        return knex.migrate.latest();
      })
      .then(function() {
        return knex.seed.run();
      })
      .then(function() {
        done();
      });
  });

  afterEach(function(done) {
    knex.migrate.rollback().then(function() {
      done();
    });
  });

  it('Student registered with teacher should be retrieved', function(done) {
    /**
     * 'student_registered_to_teacher_mike@gmail.com' and 'studentmary@gmail.com'
     * are registered to 'teachermike@gmail.com'
     */
    chai
      .request(server)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teachermike@gmail.com',
        notification: 'Hey everybody'
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('recipients');
        res.body.recipients.should.be.an('array');
        res.body.recipients.should.have.lengthOf(2);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('Student @mentioned in notification should be retrieved', function(done) {
    /**
     * 'commonstudent1@gmail.com' and 'commonstudent2@gmail.com'
     * are registered to 'teacherjoe@gmail.com'
     *
     * 'student_only_under_teacher_ken@gmail.com' and 'student_registered_to_teacher_mike@gmail.com'
     * are NOT registered to teacherjoe@gmail.com'
     */
    chai
      .request(server)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teacherjoe@gmail.com',
        notification:
          'Hello students! @student_only_under_teacher_ken@gmail.com @student_registered_to_teacher_mike@gmail.com'
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('recipients');
        res.body.recipients.should.be.an('array');
        res.body.recipients.should.have.lengthOf(4);
        res.body.recipients.should.not.have.members([
          'student_only_under_teacher_ken@gmail.com',
          'student_registered_to_teacher_mike@gmail.com'
        ]);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('Suspended student should not be retrieved', function(done) {
    /**
     * 'suspended_student_under_teacher_peter@gmail.com', 'studentagnes@gmail.com' and
     * 'studentmiche@gmail.com' are registered to 'teacherpeter@gmail.com'
     *
     * 'suspended_student_under_teacher_nick@gmail.com', studentbob@gmail.com are
     * registered to 'teachernick@gmail.com'
     *
     * Both 'suspended_student_under_teacher_peter@gmail.com' and
     * 'suspended_student_under_teacher_nick@gmail.com' are set 'suspend' = 1
     */
    chai
      .request(server)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teacherpeter@gmail.com',
        notification:
          'Hello students! @suspended_student_under_teacher_nick@gmail.com @studentbob@gmail.com'
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('recipients');
        res.body.recipients.should.be.an('array');
        res.body.recipients.should.not.have.members([
          'suspended_student_under_teacher_peter@gmail.com',
          'suspended_student_under_teacher_nick@gmail.com'
        ]);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
});
