const customerRepository = require('./customerRepository');
// './customerRepository' — same folder, so no path needed beyond the filename

async function runTests() {
  // wrapping everything in an async function so we can use 'await' cleanly

  console.log('--- findByEmail (exists) ---');
  console.log(await customerRepository.findByEmail('test@example.com'));

  console.log('--- findByEmail (does not exist) ---');
  console.log(await customerRepository.findByEmail('doesnotexist@example.com'));

  console.log('--- findByMobile (exists) ---');
  console.log(await customerRepository.findByMobile('9999999999'));
}

runTests()
  .catch((err) => console.error('Test failed:', err))
  .finally(() => process.exit());
  // process.exit() forces Node to close after the tests run —
  // otherwise the open Knex connection pool keeps the process alive