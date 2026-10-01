const HTTP_STATUS = Object.freeze({  //Object.freeze()-> protects the object's properties from being changed /saying This object is configuration/constant data. Don't modify it at runtime.
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}); // Stores the HTTP status codes used by our API.

module.exports = HTTP_STATUS; // Makes the status codes available to other files.


//const prevents you from replacing the entire variable But it doesn't prevent changing the object's properties.