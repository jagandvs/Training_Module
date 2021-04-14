const { sql, poolPromise } = require("../../database/db");
const { encryptPWD, comparePWD } = require("../../helper/helper");

exports.UPSERT_USER_MASTER = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input("UM_CODE", sql.Int, req.body[0].UM_CODE)
      .input("UM_CM_ID", sql.Int, req.body[0].UM_CM_ID)
      .input("UM_DM_CODE", sql.Int, req.body[0].UM_DM_CODE)
      .input("UM_EM_CODE", sql.Int, req.body[0].UM_EM_CODE)
      .input("UM_USERNAME", sql.VarChar, req.body[0].UM_USERNAME)
      .input("UM_PASSWORD", sql.VarChar, encryptPWD(req.body[0].UM_PASSWORD))
      .input("UM_LEVEL", sql.VarChar, req.body[0].UM_LEVEL)
      .input(
        "UM_LASTLOGIN_DATETIME",
        sql.DateTime,
        req.body[0].UM_LASTLOGIN_DATETIME
      )
      .input("UM_IP_ADDRESS", sql.VarChar, req.body[0].UM_IP_ADDRESS)
      .input("IS_ACTIVE", sql.Bit, req.body[0].IS_ACTIVE)
      .input("UM_EMAIL_SEND", sql.Bit, req.body[0].UM_EMAIL_SEND)
      .input("UM_LOGIN_FLAG", sql.Bit, req.body[0].UM_LOGIN_FLAG)
      .input("ES_DELETE", sql.Bit, req.body[0].ES_DELETE)
      .input("MODIFY", sql.Bit, req.body[0].MODIFY)
      .input("UM_IS_ADMIN", sql.Bit, req.body[0].UM_IS_ADMIN)
      .input("UM_NAME", sql.VarChar, req.body[0].UM_NAME)
      .input("UM_EMAIL", sql.VarChar, req.body[0].UM_EMAIL)
      .output("PK_CODE", sql.Int)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_USER_MASTER");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.userMaster = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("action", sql.VarChar, "GET")
      .execute("UserMaster");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.getModule = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute("getModule");
    res.json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.getScreen = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MOD_CODE", sql.Int, req.query.moduleNo)
      .execute("getScreen");
    res.json(result.recordset);
  } catch (error) {
    res.error(error.message);
  }
};

exports.userRight = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("UR_UM_CODE", sql.Int, req.body.UR_UM_CODE)
      .input("UR_SM_CODE", sql.Int, req.body.UR_SM_CODE)
      .input("UR_RIGHTS", sql.VarChar, req.body.UR_RIGHTS)
      .input("PROCESS", sql.VarChar, req.body.PROCESS)
      .input("MOD_CODE", sql.Int, req.body.MOD_CODE)
      .execute("userRight");
    res.json(result.recordset);
  } catch (error) {
    res.json(error);
  }
};

exports.insertUserRights = async (req, res) => {
  try {
    const pool = await poolPromise;
    for (let data of req.body) {
      const result = await pool
        .request()
        .input("UR_UM_CODE", sql.VarChar, data.UR_UM_CODE)
        .input("UR_SM_CODE", sql.Int, data.UR_SM_CODE)
        .input("UR_RIGHTS", sql.VarChar, data.UR_RIGHTS)
        .input("PROCESS", sql.VarChar, data.PROCESS)
        .input("MOD_CODE", sql.Int, data.MOD_CODE)
        .execute("userRight");
    }
    console.warn(result);
    res.json({ message: "created Successfully" });
  } catch (error) {
    res.json(error);
  }
};
