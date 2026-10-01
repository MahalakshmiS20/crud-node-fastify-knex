const fastify = require('fastify');
// Imports Fastify so we can create our API application.

const swagger = require('@fastify/swagger');
// Imports the Swagger plugin.
// This creates the OpenAPI documentation from our route schemas.

const swaggerUi = require('@fastify/swagger-ui');
// Imports Swagger UI.
// This gives us the interactive browser page for testing the API.

const customerRoutes = require('./routes/customerRoutes');
// Imports all customer-related routes.

const errorHandler = require('./plugins/errorHandler');
// Imports our centralized error handler.


function buildApp() {
    // Creates and configures a Fastify application.
    // server.js will call this function to get the app.

    const app = fastify({
        logger: true
    });
    // Creates the Fastify instance.
    // logger: true enables Fastify's built-in logging.


    app.setErrorHandler(errorHandler);
    // Tells Fastify to use our custom error handler
    // whenever an error occurs during request processing.


    app.register(swagger, {
        // Registers the Swagger plugin with Fastify.

        openapi: {
            // Configuration for the OpenAPI documentation.

            info: {
                // Basic information displayed in Swagger UI.

                title: 'Movie Booking API',
                // Name of our API.

                description: 'CRUD API for the Customer entity, built with Fastify + Knex + PostgreSQL',
                // Description shown in the Swagger documentation.

                version: '1.0.0'
                // Version of our API documentation.
            }
        }
    });


    app.register(swaggerUi, {
        // Registers Swagger UI.
        // This creates the actual interactive webpage.

        routePrefix: '/swagger'
        // Swagger UI will be available at:
        // http://localhost:3000/docs
    });


    app.get('/health', async (request, reply) => {
        // Creates a simple health-check endpoint.
        // We can use this to confirm that the server is running.

        return {
            status: 'ok'
        };
        // Sends { "status": "ok" } as the response.
    });


    app.register(customerRoutes, {
        // Registers all customer routes with the Fastify application.

        prefix: '/customers'
        // Adds /customers before every route
        // defined inside customerRoutes.js.
        //
        // '/'    becomes '/customers'
        // '/:id' becomes '/customers/:id'
    });


    return app;
    // Returns the configured Fastify application
    // so server.js can start it.
}


module.exports = buildApp;
// Exports the buildApp function so server.js can import it.

















// const fastify = require('fastify');
// // fastify is a FACTORY function — calling it (fastify({...})) returns a new app instance.

// function buildApp() {
//   // We wrap app creation in a function instead of running it directly at the top level.
//   // This means calling buildApp() gives you a FRESH app instance each time it's called —
//   // useful for tests later, where each test might want its own clean instance.

//   const app = fastify({ // Creates a Fastify application.
//     logger: true, // turns on Fastify's built-in logger — every request/response gets logged to the console
//   });

//   // Health check route — a simple way to confirm the server is alive and responding.
//   app.get('/health', async (request, reply) => {
    
//     return { status: 'ok' }; // Returning a plain object = Fastify automatically serializes it to JSON and sends a 200 response. No need to call reply.send() explicitly when you just 'return' a value from an async handler — Fastify handles that for you.
//   });

//   return app; // returns the fully configured fastify (but NOT listening) app.The server is NOT started here.
// }

// module.exports = buildApp; // Exports the function so server.js can create the app.