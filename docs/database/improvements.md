## Improve security
  - Use encripted connections
    - Encrypted connections use Secure Sockets Layer (SSL) or Transport Layer Security (TLS) protocols to encrypt the data in transit, making it more difficult for attackers to intercept and access the data.
    -  e.g.

        ```
          const { Client } = require("pg");
          const tls = require("tls");
          const dotenv = require("dotenv");

          dotenv.config();

          const sslOptions = {
            rejectUnauthorized: true,
          };
          const tlsClient = tls.connect(5432, process.env.DB_HOST, sslOptions);

          const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
              sslmode: "require",
              sslfactory: tlsClient,
            },
          });

          client.connect()
            .then(() => console.log("Connected to PostgreSQL server"))
            .catch((error) => console.error("Error connecting to PostgreSQL server", error));
        ``` 

## Improve performance
  - Use connection pooling.
    - When an application needs to connect to a database, it creates a new connection to the database server. Because that is a relatively expensive operation in terms of time and resources, connection pooling aims to minimize the number of connections that are created by reusing existing connections whenever possible.
    - e.g.

        ```
        // database.js
        const { Pool } = require('pg');

        // Create a new connection pool with a maximum of 20 connections
        const pool = new Pool({
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          max: 20,
        });

        module.exports = pool;


        // server.js
        const express = require("express");
        const pool = require("./database");

        const app = express();

        // Middleware function that helps to carry over the pool
        app.use((req, res, next) => {
          req.db = { pool };
          next();
        });

        // Route that uses the connection pool
        app.get("/users/:id", () => {
          async function getUser(req, res, next) {
            const { pool } = req.db;
            try {
              const result = await pool.query("SELECT * FROM users WHERE id = $1", [
                req.params.id,
              ]);
              res.json(result.rows[0]);
            } catch (err) {
              console.error(err);
              res.status(500).send("Error querying database");
            }
          }
        });

        app.listen(3000, () => {
          console.log("Server running on port 3000");
        });
      ```
