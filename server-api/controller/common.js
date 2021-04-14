const { sql, poolPromise } = require("../database/db");
const uploadFile = require("../middleware/uploadMultiple");
const fs = require("fs");
const removeDir = require("../middleware/removeDir");

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

exports.setResetModify = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("TableName", sql.VarChar, req.body.TableName)
      .input("ModField", sql.VarChar, req.body.ModField)
      .input("CodeField", sql.VarChar, req.body.codeField)
      .input("CodeVal", sql.Int, req.body.codeVal)
      .input("MODIFY", sql.VarChar, req.body.MODIFY.toString())
      .input("process", sql.VarChar, req.body.process)
      .output("PK_CODE", sql.Numeric)
      .output("ERROR", sql.VarChar)
      .execute("Modify_Lock");

    if (req.body.process == "check") {
      res.json(result.recordset.length);
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ message: error.message });
  }
};

exports.deleteRow = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PK_CODE", sql.VarChar, req.body.PK_CODE)
      .input("PK_Field", sql.VarChar, req.body.PK_FIELD)
      .input("ES_DELETE", sql.VarChar, req.body.ES_DELETE)
      .input("DELETE", sql.VarChar, req.body.DELETE)
      .input("TABLE_NAME", sql.VarChar, req.body.TABLE_NAME)
      .execute("SP_CM_DELETE");
    res.json(result);
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ message: error.message });
  }
};

exports.SP_CM_FillCombo = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("TableNames", sql.VarChar, req.body.TableNames)
      .input("fieldNames", sql.VarChar, req.body.fieldNames)
      .input("condition", sql.VarChar, req.body.condition)
      .execute("SP_CM_FillCombo");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ message: error.message });
  }
};

exports.upload = async (req, res) => {
  try {
    var dir = __basedir + "/uploads";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    var destFolder = dir + "/" + req.query.name;
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder);
    }
    var inFolder = destFolder + "/" + req.query.pk;
    if (!fs.existsSync(inFolder)) {
      fs.mkdirSync(inFolder);
    }

    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

exports.getListFiles = async (req, res) => {
  const directoryPath =
    __basedir + "/uploads/" + req.query.name + "/" + req.query.pk;

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(404).send({
        message: "Files not found",
      });
    }
    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,

        url:
          "http://localhost:3000/uploads/" +
          req.query.name +
          "/" +
          req.query.pk +
          "/" +
          file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

exports.deleteFile = async (req, res) => {
  const directoryPath = `${__basedir}/uploads/${req.body.name}/${req.body.pk}/`;

  try {
    fs.unlinkSync(directoryPath + req.body.fileName);

    res.status(200).send({
      message: "File Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "unable to delete" + error,
    });
  }
};

exports.downloadFile = async (req, res) => {
  const fileName = req.query.fileName;
  const directoryPath = `${__basedir}/uploads/${req.query.name}/${req.query.pk}/`;

  res.download(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
