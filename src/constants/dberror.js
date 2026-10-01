// Postgres error codes (from the pg driver's error.code property).
// Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_ERROR_CODES = Object.freeze({
  UNIQUE_VIOLATION: '23505',   // duplicate value in a column with a UNIQUE constraint (our email/mobile checks)
  // add more here later if needed, e.g. FOREIGN_KEY_VIOLATION: '23503' for Booking/Payment relations
});

module.exports = PG_ERROR_CODES;