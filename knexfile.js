// Update with your config settings.

module.exports = {
  test: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'student_mgmt_db_test',
      user: 'root',
      password: 'P@ssw0rd'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    }
  },

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'student_mgmt_db',
      user: 'root',
      password: 'P@ssw0rd'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/development'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_HOSTNAME,
      database: 'student_mgmt_db',
      user: process.env.DATABASE_LOGIN,
      password: process.env.DATABASE_PASSWORD
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/production'
    }
  }
};
