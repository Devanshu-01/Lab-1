import mysql from "mysql2/promise";

// A connection pool reuses connections across many requests.
// A server handles many requests at once, so use createPool, not createConnection.
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "tenanttrails",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // return DATE/DATETIME as "YYYY-MM-DD" strings, like the old mock data
});

export default pool;
