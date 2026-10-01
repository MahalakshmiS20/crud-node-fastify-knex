require('dotenv').config();
// load .env first, same reasoning as before

const buildApp = require('./app'); // importing app.js file ,CommonJS: no .js extension needed
const app = buildApp();   // <-- must CALL it to actually get a real app instance

const PORT = Number(process.env.PORT) || 4000; // same as before — convert the string from .env to a number, fallback to 4000 when port is in use

async function start() {
  try {
    await app.listen({ // Fastify listens on port 3000 through all network interfaces// .listen() returns a Promise 
         port: PORT, 
         host: '0.0.0.0'
    });
     console.log(`Server started successfully on port ${PORT}`);
    // This runs only after the server has successfully started.

  } catch (error) {
    app.log.error(error);
    process.exit(1); // Stops the Node.js process because the server couldn't start , exit(0)=> program ended successfully
  }
}

start(); // actually call the function to kick everything off