const { sql, poolPromise } = require("../../database/db");

exports.getEmployeeHistoryCard = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("fromdate", sql.DateTime, req.body.fromdate)
      .input("todate", sql.DateTime, req.body.todate)
      .execute("getEmployeeHistoryCard");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getEmployeeHistoryCardofEmployee = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("empid", sql.Int, req.body.empid)

      .execute("getEmployeeHistoryCardofEmployee");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getpresentskills = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EmpType", sql.Int, req.body.EmpType)

      .execute("getpresentskills");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getTRAININGNEEDS = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EmpType", sql.Int, req.body.EmpType)
      .input("Depid", sql.Int, req.body.Depid)
      .input("AllDep", sql.Bit, req.body.AllDep)

      .execute("getTRAININGNEEDS");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getTRAININGCALENDER = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EmpType", sql.Int, req.body.EmpType)
      .input("depid", sql.Int, req.body.Depid)
      .input("allDep", sql.Bit, req.body.AllDep)

      .execute("getTRAININGCALENDER");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};
