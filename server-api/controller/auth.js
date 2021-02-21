const { sql, poolPromise } = require("../database/db");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const { encryptPWD, comparePWD } = require("../helper/helper");

exports.signin = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("UM_USERNAME", sql.VarChar, req.body.username)
      .execute("getUserDetails");
    if (result.recordset[0] == undefined) {
      return res.status(401).json({
        error: "User not found",
      });
    }
    const matcher_True = comparePWD(
      req.body.password,
      result.recordset[0].UM_PASSWORD
    );
    const companyDetails = await pool
      .request()
      .input("TableNames", sql.VarChar, "COMPANY_MASTER")
      .input("fieldNames", sql.VarChar, "*")
      .input("condition", sql.VarChar, `CM_CODE=${req.body.cm_code}`)
      .execute("SP_CM_TableResponse");

    if (matcher_True) {
      const token = jwt.sign(
        { id: result.recordset[0].UM_CODE },
        process.env.SECRET
      );
      res.cookie("token", token, { expire: new Date() + 9999 });
      return res.json({
        token,
        user: result.recordset[0],
        companyDetails: companyDetails.recordset[0],
      });
    } else {
      return res.status(401).json({
        error: "Wrong Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: "user Not found",
    });
  }
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  // userProperty: "auth",
  algorithms: ["HS256"],
});
