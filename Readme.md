# Student Management API

## Instructions for running local instance of API server

1.  Download and install MySQL
2.  Create 2 empty databases for `student_mgmt_db` and `student_mgmt_db_test`:

    ```
    /* For production/development environment */
    CREATE DATABASE `student_mgmt_db`;

    /* For test environment */
    CREATE DATABASE `student_mgmt_db_test`;
    ```

3.  Open `knexfile.js` and change the database login and password for `development` and `test` environments:

    ```
    module.exports = {
        // For test environment
        test: {
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                database: 'student_mgmt_db_test',
                user: '<database_login>',
                password: '<database_password>'
            },
            ......
        },

        // For development environment
        development: {
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                database: 'student_mgmt_db',
                user: '<database_login>',
                password: '<database_password>'
            },
            ......
        },

        ......
    };
    ```

4.  If you are running a production deployment, the database server, login and password are set using following the environment variables (you can install the `dotenv` package and create a `.env` file):
    ```
    DATABASE_HOSTNAME=<server>
    DATABASE_LOGIN=<database_login>
    DATABASE_PASSWORD=<database_password>
    ```
5.  Run `npm install` or `yarn install` to install the project dependencies.
6.  Migrate the database schema:
    ```
    npm run db:migrate
    ```
    or
    ```
    yarn run db:migrate
    ```
7.  Seed the database with some sample initial data:

    ```
    npm run db:seed
    ```

    or

    ```
    yarn run db:seed
    ```

    To rollback the migration, run the `db:rollback` script to drop all the database tables.

    You can create seed files in `db/seeds` directory for the different deployment environments. Seed files are executed in alphabetical order. Unlike migrations, every seed file will be executed when you run the command. You should design your seed files to reset tables as needed before inserting data.

8.  To run unit and integration tests on the API, run the following:
    ```
    npm test
    ```
    or
    ```
    yarn test
    ```
9.  To start running the local instance of the API server:

    ```
    npm start
    ```

    or

    ```
    yarn start
    ```

    By default, the server will start in development mode unless the environment variable `NODE_ENV=production` is provided when starting the server.

    The server instance will be listening in port 3000 by default. This can be changed by setting the `PORT` environment variable.

## Link(s) to the hosted API

* TODO
