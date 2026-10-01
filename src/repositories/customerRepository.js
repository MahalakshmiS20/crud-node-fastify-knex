const db = require('../config/db'); // Imports the shared Knex database connection.
const TABLE = 'customers'; // Stores the table name so we don't repeatedly write 'customers'.

const SAFE_COLUMNS = [
    'customer_id',
    'customer_name',
    'customer_mobile_number',
    'customer_email_id'
];// These are the columns that are safe to return. Notice: customer_password is NOT included.

function toApiShape(row) { // Converts database column names into API property names.

    if (!row) {
        return null;
    }// If no database row was found, return null.

    return {
        customerId: row.customer_id,
        customerName: row.customer_name,
        customerMobileNumber: row.customer_mobile_number,
        customerEmailId: row.customer_email_id
    };
}

 // Gets all customers from the database.
async function findAll() {
    const rows = await db(TABLE).select(SAFE_COLUMNS); // SELECT only the safe columns from customers.
    return rows.map(toApiShape); // Converts every database row into our API format.
}

// Finds one customer using customer_id.
async function findById(id) {
    const row = await db(TABLE)
        .select(SAFE_COLUMNS)
        .where('customer_id', id)   // where() finds the matching ID.
        .first();     // first() gives us one object instead of an array=> limit 1
    return toApiShape(row);
}

// Checks whether an email already exists.
async function findByEmail(email) {
    return db(TABLE)
        .select('customer_id')
        .where('customer_email_id', email)
        .first();
}

// Checks whether a mobile number already exists.
async function findByMobile(mobile) {
    return db(TABLE)
        .select('customer_id')
        .where('customer_mobile_number', mobile)
        .first();
}

// Inserts a new customer.
async function create(data) {
    const [row] = await db(TABLE)
        .insert({
            customer_name: data.customerName,
            customer_mobile_number: data.customerMobileNumber,
            customer_email_id: data.customerEmailId,
            customer_password: data.hashedPassword
        })
        .returning(SAFE_COLUMNS); 
    // PostgreSQL returns the inserted row.
    // SAFE_COLUMNS prevents the password from coming back.

    return toApiShape(row);
}

// Updates an existing customer.
async function update(id, data) {
    const [row] = await db(TABLE)
        .where('customer_id', id)
        .update({
            customer_name: data.customerName,
            customer_mobile_number: data.customerMobileNumber,
            customer_email_id: data.customerEmailId,
            customer_password: data.hashedPassword
        })
        .returning(SAFE_COLUMNS);

    return toApiShape(row);
}

// Deletes a customer.
async function remove(id) {
    const deletedCount = await db(TABLE)
        .where('customer_id', id)
        .del();   // del() returns the number of deleted rows.

    return deletedCount > 0;
    // true = customer was deleted.
    // false = customer didn't exist.
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    findByMobile,
    create,
    update,
    remove
};