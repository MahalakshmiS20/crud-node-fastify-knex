const db = require('./db'); // Imports the Knex instance from our db.js file.
// './db' means "the db.js file in this same folder" — require() automatically assumes .js if you omit it in CommonJS

db.raw('SELECT 1+1 AS result') //raw sql 
    // Sends this SQL directly to PostgreSQL.
    // We expect PostgreSQL to calculate 1 + 1.
  .then((result) => { // Starts a block where we attempt the database operation.
    console.log('Connection successful:', result.rows[0]); // Prints the first returned row.
  })
  .catch((err) => {  // Runs if the database operation fails.
    console.error('Connection failed:', err.message); // Prints the error message.

  })
  .finally(() => {  // Runs whether the query succeeds or fails.
    db.destroy(); // Closes Knex's connection pool so Node can exit normally Otherwise the test process may remain alive waiting because the pool still exists.
  });