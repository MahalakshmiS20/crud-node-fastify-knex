const customerHandler = require('../handlers/customerHandler'); // Imports all customer handler functions.
const { // Imports the schemas created in Step 8. // These schemas validate the incoming request and outgoing response.
    idParamSchema,
    createCustomerBodySchema,
    updateCustomerBodySchema,
    customerResponseSchema,
    customerListResponseSchema
} = require('../schemas/customerSchema');



async function customerRoutes(app, options) { //app->That's the Fastify instance ,  This function registers all customer-related routes on it.

    // GET /customers   
    app.get('/', {
        schema: {
            response: {
                200: customerListResponseSchema
            }
        }
    }, customerHandler.getAllCustomers);
    // Sends the request to getAllCustomers().
    // The response must match customerListResponseSchema.

    // GET /customers/:id
    app.get('/:id', {
        schema: {
            params: idParamSchema,
            response: {
                200: customerResponseSchema
            }
        }
    }, customerHandler.getCustomerById);
    // Validates the id using idParamSchema.
    // Then calls getCustomerById().

    // POST /customers
    app.post('/', {
        schema: {
            body: createCustomerBodySchema,
            response: {
                201: customerResponseSchema
            }
        }
    }, customerHandler.createCustomer);
    // Validates the request body.
    // Then calls createCustomer().
    // Successful creation returns 201.

    // PUT /customers/:id
    app.put('/:id', {
        schema: {
            params: idParamSchema,
            body: updateCustomerBodySchema,
            response: {
                200: customerResponseSchema
            }
        }
    }, customerHandler.updateCustomer);
    // Validates both the id and request body.
    // Then calls updateCustomer().

    // DELETE /customers/:id
    app.delete('/:id', {
        schema: {
            params: idParamSchema
        }
    }, customerHandler.deleteCustomer);
    // Validates the id.
    // Then calls deleteCustomer().
}


module.exports = customerRoutes; // Exports the route function so app.js can register it.