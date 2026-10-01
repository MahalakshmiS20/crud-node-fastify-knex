// Validates the :id parameter in URLs such as /customers/5.
const idParamSchema = {
    type: 'object',

    properties: {
        id: {
            type: 'integer',
            minimum: 1
        }
    },

    required: ['id']
};


// Validates the request body when creating a customer.
const createCustomerBodySchema = {
    type: 'object',

    properties: {
        customerName: {
            type: 'string',
            minLength: 1,
            maxLength: 100
        },

        customerMobileNumber: {
            type: 'string',
            minLength: 7,
            maxLength: 15,
            pattern: '^[0-9+]+$'
        },

        customerEmailId: {
            type: 'string',
            format: 'email',
            maxLength: 100
        },

        customerPassword: {
            type: 'string',
            minLength: 6,
            maxLength: 72
        }
    },

    required: [
        'customerName',
        'customerMobileNumber',
        'customerEmailId',
        'customerPassword'
    ],

    additionalProperties: false // Don't allow fields that aren't defined in properties.
};


// Validates the request body when updating a customer.
const updateCustomerBodySchema = {
    type: 'object',

    properties: {
        customerName: {
            type: 'string',
            minLength: 1,
            maxLength: 100
        },

        customerMobileNumber: {
            type: 'string',
            minLength: 7,
            maxLength: 15,
            pattern: '^[0-9+]+$'
        },

        customerEmailId: {
            type: 'string',
            format: 'email',
            maxLength: 100
        },

        customerPassword: {
            type: 'string',
            minLength: 6,
            maxLength: 72
        }
    },

    required: [
        'customerName',
        'customerMobileNumber',
        'customerEmailId',
        'customerPassword'
    ],

    additionalProperties: false
};


// Defines the fields that are allowed in a customer response.
// Notice that customerPassword is intentionally NOT included.
const customerResponseSchema = {
    type: 'object',

    properties: {
        customerId: {
            type: 'integer'
        },

        customerName: {
            type: 'string'
        },

        customerMobileNumber: {
            type: 'string'
        },

        customerEmailId: {
            type: 'string'
        }
    }
};


// Defines the response when multiple customers are returned.
const customerListResponseSchema = {
    type: 'array',

    items: customerResponseSchema
};


// Defines the common structure of an error response.
const errorResponseSchema = {
    type: 'object',

    properties: {
        statusCode: {
            type: 'integer'
        },

        message: {
            type: 'string'
        }
    }
};


// Exports all schemas so routes can use them.
module.exports = {
    idParamSchema,
    createCustomerBodySchema,
    updateCustomerBodySchema,
    customerResponseSchema,
    customerListResponseSchema,
    errorResponseSchema
};