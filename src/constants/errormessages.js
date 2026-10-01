const MESSAGES = { // Stores all reusable user-facing messages in one object.
  // Success messages
  CUSTOMER_CREATED: 'Customer created successfully.',
  CUSTOMER_UPDATED: 'Customer updated successfully.',
  CUSTOMER_DELETED: 'Customer deleted successfully.',

  // Client error messages (400/404)
  CUSTOMER_NOT_FOUND: 'Customer not found.',
  EMAIL_ALREADY_EXISTS: 'A customer with this email already exists.',
  MOBILE_ALREADY_EXISTS: 'A customer with this mobile number already exists.',
  VALIDATION_FAILED: 'Validation failed. Please check the submitted data.', // catches wrong type, string too long, invalid email format
  REQUIRED_FIELDS: 'Required fields are missing.',
  INVALID_CUSTOMER_ID: 'Invalid customer ID.', //get/customers/abc

  // Generic fallback (500)
  INTERNAL_ERROR: 'Something went wrong. Please try again later.',
}; 


module.exports = MESSAGES; // Exports the object so handlers can use these messages