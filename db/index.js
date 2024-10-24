const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecommerce",
  port: 5432,
});

const getClient = () => {
  return pool.connect();
};

const query = async (text, params) => {
  // const start = Date.now();
  const res = await pool.query(text, params);
  // const duration = Date.now() - start;
  // console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

const getAllData = async (table) => {
  try {
    const query = await pool.query("SELECT * FROM " + table + " ;");
    return query.rows;
  } catch (err) {
    console.error(`Error fetching data from table: ${table}`, err);
    throw err; // Rethrow error to be handled by the route handler
  }
};

module.exports = {
  pool,
  query,
  getClient,
  getAllData,
};
