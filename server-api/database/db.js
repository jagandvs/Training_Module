const sql = require("mssql");

const config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  port: parseInt(process.env.DBPORT),
  database: process.env.DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

// SECRET=secret
// USER=DB_A2EA4B_newerpdb_admin
// PASSWORD=abcd@1234
// SERVER=SQL5101.site4now.net
// DBPORT=1433
// DATABASE=DB_A2EA4B_newerpdb

// SECRET=secret
// USER=DB_A2EA4B_erpdevlopment_admin
// PASSWORD=abcd@1234
// SERVER=SQL5102.site4now.net
// DBPORT=1433
// DATABASE=DB_A2EA4B_erpdevlopment

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));

module.exports = {
  sql,
  poolPromise,
};
