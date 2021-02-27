const { sql, poolPromise } = require("../../database/db");

exports.UPSERT_category_master = async (req, res) => {
  console.log(req.body);
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input("category_id", sql.Int, req.body[0].category_id)
      .input(
        "category_id_CM_COMP_ID",
        sql.Int,
        req.body[0].category_id_CM_COMP_ID
      )
      .input("category_name", sql.VarChar, req.body[0].category_name)
      .input("category_type", sql.Bit, req.body[0].category_type)
      .input(
        "cateogry_applicable_to",
        sql.Int,
        req.body[0].cateogry_applicable_to
      )
      .input("ES_DELETE", sql.Bit, 0)
      .input("ES_MODIFY", sql.Bit, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_category_master");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.UPSERT_CategoryToSkillLevel_Master = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input(
        "CategoryToSkillLevelMaster_ID",
        sql.Int,
        req.body[0].CategoryToSkillLevelMaster_ID
      )
      .input(
        "CategoryToSkillLevelMaster_CM_COMP_ID",
        sql.Int,
        req.body[0].CategoryToSkillLevelMaster_CM_COMP_ID
      )
      .input(
        "CategoryToSkillLevelMaster_categorymaster_id",
        sql.Int,
        req.body[0].CategoryToSkillLevelMaster_categorymaster_id
      )
      .input(
        "CategoryToSkillLevelMaster_title",
        sql.VarChar,
        req.body[0].CategoryToSkillLevelMaster_title
      )
      .input(
        "CategoryToSkillLevelMaster_passingpercentage",
        sql.Float,
        req.body[0].CategoryToSkillLevelMaster_passingpercentage
      )
      .input("es_delete", sql.Bit, 0)
      .input("es_modify", sql.Bit, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_CategoryToSkillLevel_Master");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.UPSERT_customer_master = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input("customer_id", sql.Int, req.body[0].customer_id)
      .input(
        "customer_id_CM_COMP_ID",
        sql.Int,
        req.body[0].customer_id_CM_COMP_ID
      )
      .input("customer_name", sql.VarChar, req.body[0].customer_name)
      .input("customer_category", sql.Bit, req.body[0].customer_category)
      .input(
        "customer_titleofprogram",
        sql.VarChar,
        req.body[0].customer_titleofprogram
      )
      .input(
        "customer_expectedskills",
        sql.VarChar,
        req.body[0].customer_expectedskills
      )
      .input("es_delete", sql.Bit, 0)
      .input("es_modify", sql.Bit, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_customer_master");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.UPSERT_department_master = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input("department_id", sql.Int, req.body[0].department_id)
      .input(
        "department_CM_COMP_ID",
        sql.Int,
        req.body[0].department_CM_COMP_ID
      )
      .input("department_name", sql.VarChar, req.body[0].department_name)

      .input("es_delete", sql.Bit, 0)
      .input("es_modify", sql.Bit, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_department_master");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.UPSERT_process_master = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input("process_id", sql.Int, req.body[0].process_id)
      .input("process_CM_COMP_ID", sql.Int, req.body[0].process_CM_COMP_ID)
      .input("process_name", sql.VarChar, req.body[0].process_name)
      .input(
        "process_applicable_to",
        sql.VarChar,
        req.body[0].process_applicable_to
      )
      .input("es_delete", sql.Bit, 0)
      .input("es_modify", sql.Bit, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_process_master");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.UPSERT_StudyMaterialMaster = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input(
        "StudyMaterialMaster_id",
        sql.Int,
        req.body[0].StudyMaterialMaster_id
      )
      .input(
        "StudyMaterialMaster_CM_COMP_ID",
        sql.Int,
        req.body[0].StudyMaterialMaster_CM_COMP_ID
      )
      .input(
        "StudyMaterialMaster_filetype",
        sql.VarChar,
        req.body[0].StudyMaterialMaster_filetype
      )
      .input(
        "StudyMaterialMaster_location",
        sql.VarChar,
        req.body[0].StudyMaterialMaster_location
      )
      .input(
        "StudyMaterialMaster_skilllevelid",
        sql.VarChar,
        req.body[0].StudyMaterialMaster_skilllevelid
      )
      .input("es_modify", sql.Bit, 0)
      .input("es_delete", sql.Bit, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_StudyMaterialMaster");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};

exports.UPSERT_TrainingProgramMaster = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[1].process)
      .input(
        "TrainingProgramMaster_ID",
        sql.Int,
        req.body[0].TrainingProgramMaster_ID
      )
      .input(
        "TrainingProgramMaster_CM_COMP_ID",
        sql.Int,
        req.body[0].TrainingProgramMaster_CM_COMP_ID
      )
      .input(
        "TrainingProgramMaster_processMasterid",
        sql.Int,
        req.body[0].TrainingProgramMaster_processMasterid
      )
      .input(
        "TrainingProgramMaster_categoryid",
        sql.Int,
        req.body[0].TrainingProgramMaster_categoryid
      )
      .input(
        "TrainingProgramMaster_skilllevelid",
        sql.Int,
        req.body[0].TrainingProgramMaster_skilllevelid
      )
      .input(
        "TrainingProgramMaster_title",
        sql.VarChar,
        req.body[0].TrainingProgramMaster_title
      )
      .input(
        "TrainingProgramMaster_duration",
        sql.Float,
        req.body[0].TrainingProgramMaster_duration
      )
      .input(
        "TrainingProgramMaster_location",
        sql.VarChar,
        req.body[0].TrainingProgramMaster_location
      )
      .input(
        "TrainingProgramMaster_modeOfTraining",
        sql.VarChar,
        req.body[0].TrainingProgramMaster_modeOfTraining
      )
      .input(
        "TrainingProgramMaster_iscustomerend",
        sql.Bit,
        req.body[0].TrainingProgramMaster_iscustomerend
      )
      .input(
        "TrainingProgramMaster_evalfrom",
        sql.DateTime,
        req.body[0].TrainingProgramMaster_evalfrom
      )
      .input(
        "TrainingProgramMaster_evalto",
        sql.DateTime,
        req.body[0].TrainingProgramMaster_evalto
      )
      .input("es_modify", sql.Bit, 0)
      .input("es_delete", sql.Bit, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_TrainingProgramMaster");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
    console.log(error);
  }
};
