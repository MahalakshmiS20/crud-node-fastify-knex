const HTTP_STATUS = require('../constants/httpStatus');
const PG_ERROR_CODES = require('../constants/dberror');
const MESSAGES = require('../constants/errormessages');

function errorHandler(error, request, reply) {
  // This function's signature (error, request, reply) is FIXED — Fastify calls
  // it with these exact three arguments whenever ANY error is thrown or occurs
  // anywhere during request handling (in a schema check, in a handler, anywhere).

  // --- Case 1: Fastify/Ajv schema validation failed ---
  if (error.validation) {
    // Fastify attaches a 'validation' property to the error object specifically
    // when the request failed JSON schema validation (missing field, wrong type,
    // string too long, etc.) — this is how we detect THIS specific case.

    request.log.warn({ validation: error.validation }, 'Validation failed');
    // request.log is the same Pino logger from app.js's { logger: true }.
    // .warn(...) logs it as a warning (not as severe as .error()) — a bad request
    // isn't a server bug, just invalid input.

    return reply.code(HTTP_STATUS.BAD_REQUEST).send({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: MESSAGES.VALIDATION_FAILED,
      details: error.validation,
      // include Ajv's specific validation errors too, so the client knows
      // exactly WHICH field failed and why — useful for debugging in Swagger
    });
  }

  // --- Case 2: Postgres unique constraint violation (race-condition safety net) ---
  if (error.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
    // error.code is set by the 'pg' driver itself when Postgres rejects an
    // INSERT/UPDATE due to a UNIQUE constraint. '23505' is Postgres's own
    // standard error code for this (not something we invented).

    request.log.warn({ constraint: error.constraint }, 'Unique constraint violated');

    // error.constraint tells us WHICH named constraint was violated —
    // this is exactly why we named them explicitly back in Step 3
    // (uq_customers_email, uq_customers_mobile)
    let message = MESSAGES.VALIDATION_FAILED;
    if (error.constraint === 'uq_customers_email') {
      message = MESSAGES.EMAIL_ALREADY_EXISTS;
    } else if (error.constraint === 'uq_customers_mobile') {
      message = MESSAGES.MOBILE_ALREADY_EXISTS;
    }

    return reply.code(HTTP_STATUS.BAD_REQUEST).send({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message,
    });
  }

  // --- Case 3: anything else unexpected ---
  request.log.error(error);
  // log the FULL error internally (for you/your team to debug), but NEVER
  // send these details back to the client — that could leak sensitive
  // internals (stack traces, DB structure, etc.)

  return reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: MESSAGES.INTERNAL_ERROR,
  });
}

module.exports = errorHandler;