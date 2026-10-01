require('dotenv').config();
// Loads .env values into process.env before we use them.

const knex = require('knex');
// Imports the Knex factory function.    —  by calling it returns a configured knex instance.

const db = knex({    // Creates our configured Knex instance.
  client: 'pg',                     // Tells Knex to use PostgreSQL.     // use the Postgres driver
  connection: {
    host: process.env.DB_HOST,           // e.g. "localhost" — string, used as-is
    port: Number(process.env.DB_PORT),   // env vars are always strings, so convert "5432" -> 5432
    database: process.env.DB_NAME,       // e.g. "movie_booking"
    user: process.env.DB_USER,           // e.g. "postgres"
    password: process.env.DB_PASSWORD,   // your real DB password, read from .env, never hardcoded
  },
  pool:  // Configures the reusable database connection pool.
  {
     min: 0,// The pool doesn't have to keep a minimum number of idle connections open so when the application isn't doing database wor
     max: 10 // At most 10 database reusedconnections can be active in this pool at a time.
  },             
});

module.exports = db;
// Export the ONE configured knex instance — every other file that requires this gets the same shared object