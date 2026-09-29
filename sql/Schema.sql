-- customers table: stores registered users of the movie booking system
CREATE TABLE customers (
    customer_id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- auto-incrementing PK
    customer_name           VARCHAR(100) NOT NULL,                        -- required, matches .NET's [Required]
    customer_mobile_number  VARCHAR(15)  NOT NULL,                        -- required, uniqueness enforced below
    customer_email_id       VARCHAR(100) NOT NULL,                        -- required, uniqueness enforced below
    customer_password       VARCHAR(255) NOT NULL,                        -- required, stores the BCRYPT HASH, not plaintext

    CONSTRAINT uq_customers_email  UNIQUE (customer_email_id),  -- named constraint, so Postgres error tells us WHICH field
    CONSTRAINT uq_customers_mobile UNIQUE (customer_mobile_number)
);