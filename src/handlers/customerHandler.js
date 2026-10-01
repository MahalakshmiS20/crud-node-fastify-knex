const bcrypt = require('bcryptjs'); // Imports bcrypt for hashing customer passwords.
const customerRepository = require('../repositories/customerRepository'); // Imports repository functions for database operations.
const HTTP_STATUS = require('../constants/httpStatus'); // Imports HTTP status codes such as 200, 201, 400, and 404.
const MESSAGES = require('../constants/errormessages'); // Imports centralized response messages.

const SALT_ROUNDS = 10;
// Number of bcrypt hashing rounds.
// Higher value = stronger/slower hashing.

 // Handles GET /customers.
async function getAllCustomers(request, reply) {
    const customers = await customerRepository.findAll(); // Asks the repository to get all customers from PostgreSQL.
    return customers;// Fastify sends the returned array as a JSON response with 200 OK.
}

// Handles GET /customers/:id.
async function getCustomerById(request, reply) {
    const { id } = request.params; // Gets the id from the URL. // Example: /customers/5 → id = 5.
    const customer = await customerRepository.findById(id); // Asks the repository to find the customer with this ID.

    if (!customer) { // If the repository found no customer...
        return reply
            .code(HTTP_STATUS.NOT_FOUND)
            .send({
                message: MESSAGES.CUSTOMER_NOT_FOUND
            }); // Sends 404 because the requested customer doesn't exist.
    }

    return customer; // Sends the customer as the response.
}

// Handles POST /customers.
async function createCustomer(request, reply) {
    const {
        customerName,
        customerMobileNumber,
        customerEmailId,
        customerPassword
    } = request.body; // Gets the required customer fields from the request body.

    const existingEmail = await customerRepository.findByEmail(customerEmailId);
    if (existingEmail) { // If the email already exists...

        return reply
            .code(HTTP_STATUS.BAD_REQUEST)
            .send({
                message: MESSAGES.EMAIL_ALREADY_EXISTS
            }); // Stops here and tells the client the email is already used.
    }


    const existingMobile =await customerRepository.findByMobile(customerMobileNumber); // Checks whether another customer already uses this mobile number.

    if (existingMobile) {  // If the mobile number already exists...

        return reply
            .code(HTTP_STATUS.BAD_REQUEST)
            .send({
                message: MESSAGES.MOBILE_ALREADY_EXISTS
            }); // Stops here and tells the client the mobile is already used.
    }


    const hashedPassword =await bcrypt.hash(customerPassword, SALT_ROUNDS);
    // Converts the plain password into a one-way hash.
    // The plain password is never sent to the repository.


    const newCustomer =await customerRepository.create({
            customerName,
            customerMobileNumber,
            customerEmailId,
            hashedPassword
        }); // Sends the customer data to the repository.// The repository will insert the data into PostgreSQL.


    return reply
        .code(HTTP_STATUS.CREATED)
        .send(newCustomer); // Sends 201 Created along with the newly created customer's safe data.
}

// Handles PUT /customers/:id.
async function updateCustomer(request, reply) {

    const { id } = request.params; // Gets the customer ID from the URL.

    const {
        customerName,
        customerMobileNumber,
        customerEmailId,
        customerPassword
    } = request.body;
    // Gets the updated customer information from the request body.


    const existingCustomer =await customerRepository.findById(id); // First checks whether the customer actually exists.

    if (!existingCustomer) {// If the customer doesn't exist...
        return reply
            .code(HTTP_STATUS.NOT_FOUND)
            .send({
                message: MESSAGES.CUSTOMER_NOT_FOUND
            });// Sends 404 because there is nothing to update.
    }


    const existingEmail = await customerRepository.findByEmail(customerEmailId); // Checks whether another customer already uses this email.

    if (existingEmail && existingEmail.customer_id !== id) { // If an email was found AND it belongs to another customer...
        return reply
            .code(HTTP_STATUS.BAD_REQUEST)
            .send({
                message: MESSAGES.EMAIL_ALREADY_EXISTS
            }); // Rejects the update because another customer owns this email.
    }


    const existingMobile = await customerRepository.findByMobile(customerMobileNumber); // Checks whether another customer already uses this mobile number.
    if (existingMobile && existingMobile.customer_id !== id) {  // If the mobile belongs to another customer...

        return reply
            .code(HTTP_STATUS.BAD_REQUEST)
            .send({
                message: MESSAGES.MOBILE_ALREADY_EXISTS
            }); // Rejects the update because another customer owns this mobile.
    }


    const hashedPassword =  await bcrypt.hash(customerPassword, SALT_ROUNDS);
    // Hashes the new password before sending it to the repository.


    const updatedCustomer = await customerRepository.update(id, {
            customerName,
            customerMobileNumber,
            customerEmailId,
            hashedPassword
        });// Sends the updated data to the repository for the database UPDATE.


    return reply
        .code(HTTP_STATUS.OK)
        .send(updatedCustomer); // Sends 200 OK with the updated customer's safe data.
}

// Handles DELETE /customers/:id.
async function deleteCustomer(request, reply) {
    const { id } = request.params; // Gets the customer ID from the URL.

    const wasDeleted = await customerRepository.remove(id); // Asks the repository to delete the customer.// Repository returns true if a row was deleted, otherwise false.

    if (!wasDeleted) {// If nothing was deleted, the customer doesn't exist.

        return reply
            .code(HTTP_STATUS.NOT_FOUND)
            .send({
                message: MESSAGES.CUSTOMER_NOT_FOUND
            });// Sends 404 because the customer was not found.
    }


    return reply
        .code(HTTP_STATUS.OK)
        .send({
            message: MESSAGES.CUSTOMER_DELETED
        }); // Sends 200 OK after successful deletion.
}


module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};// Exports all handler functions so customerRoutes.js can use them.