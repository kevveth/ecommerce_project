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

module.exports = {
  pool,
  query,
  getClient,
};
