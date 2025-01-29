const { Pool } = require("pg");
const db = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    // "postgres://localhost:5432/34a-classroom_manager",
    "postgres://localhost:5432/acme_classroom_manager_db",
});

async function query(sql, params, callback) {
  return db.query(sql, params, callback);
}

module.exports = { query };
