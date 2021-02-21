const { sql, poolPromise } = require("../database/db");

exports.TableResponse = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("TableNames", sql.VarChar, req.body.tableNames)
      .input("fieldNames", sql.VarChar, req.body.fieldNames)
      .input("condition", sql.VarChar, req.body.condition)
      .execute("SP_CM_TableResponse");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.logger = async (req, res, next) => {
  // console.log(logDetails.companyDetails.CM_CODE);
  // var logDetails = JSON.parse(req.headers.logger);

  // console.log(logDetails.companyDetails.CM_CODE);
  // console.log(logDetails.companyDetails.CM_ID);
  // console.log(req.url);
  // console.log(logDetails.companyDetails.CM_NAME);
  // console.log(logDetails.user.UM_NAME);
  // console.log(new Date().toISOString());
  // next();

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("LG_CM_CODE", sql.Int, req.headers.lg_cm_code)
      .input("LG_CM_COMP_ID", sql.Int, req.headers.lg_cm_comp_id)
      .input("LG_DATE", sql.DateTime, req.headers.lg_date)
      .input("LG_SOURCE", sql.VarChar, req.headers.lg_source)
      .input("LG_EVENT", sql.VarChar, req.headers.lg_event)
      .input("LG_COMP_NAME", sql.VarChar, req.headers.lg_comp_name)
      .input("LG_DOC_NO", sql.VarChar, req.headers.lg_doc_no)
      .input("LG_DOC_NAME", sql.VarChar, req.headers.lg_doc_name)
      .input("LG_DOC_CODE", sql.Int, req.headers.lg_doc_code)
      .input("LG_U_NAME", sql.VarChar, req.headers.lg_u_name)
      .input("LG_U_CODE", sql.Int, req.headers.lg_u_code)
      .input("LG_IP_ADDRESS", sql.VarChar, req.ip)
      .execute("insertLog");
    next();
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
