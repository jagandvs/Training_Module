const { sql, poolPromise } = require("../../database/db");

exports.UPSERT_QuestionBank = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body.process)
      .input("QUESTIONBANKMASTER_ID", sql.Int, req.body.QUESTIONBANKMASTER_ID)
      .input(
        "QUESTIONBANKMASTER_CM_COMP_ID",
        sql.Int,
        req.body.QUESTIONBANKMASTER_CM_COMP_ID
      )
      .input(
        "QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID",
        sql.Int,
        req.body.QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID
      )
      .input(
        "QUESTIONBANKMASTER_QUESTIONTYPE",
        sql.Bit,
        req.body.QUESTIONBANKMASTER_QUESTIONTYPE
      )
      .input(
        "QUESTIONBANKMASTER_QUESTIONTITLE",
        sql.VarChar,
        req.body.QUESTIONBANKMASTER_QUESTIONTITLE
      )
      .input(
        "QUESTIONBANKMASTER_TRAININGTRANSACTIONID",
        sql.Int,
        req.body.QUESTIONBANKMASTER_TRAININGTRANSACTIONID
      )
      .input(
        "QUESTIONBANKMASTER_TRAININGMASTERID",
        sql.Int,
        req.body.QUESTIONBANKMASTER_TRAININGMASTERID
      )
      .input(
        "QUESTIONBANKMASTER_MARKS",
        sql.Int,
        req.body.QUESTIONBANKMASTER_MARKS
      )
      .input("ES_MODIFY", sql.Int, 0)
      .input("ES_DELETE", sql.Int, 0)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_QuestionBank");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.INSERT_UPSERT_QuestionBank = async (req, res) => {
  var DT_QUESTIONBANK_DETAIL = new sql.Table();

  DT_QUESTIONBANK_DETAIL.columns.add(
    "QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID",
    sql.VarChar
  );
  DT_QUESTIONBANK_DETAIL.columns.add("QUESTIONBANKDETAIL_ANSWER", sql.VarChar);
  DT_QUESTIONBANK_DETAIL.columns.add(
    "QUESTIONBANKDETAIL_WEIGHTAGE",
    sql.VarChar
  );

  for (let data of req.body[1]) {
    DT_QUESTIONBANK_DETAIL.rows.add(
      data.QUESTIONBANKDETAIL_QUESTIONBANKMASTER_ID,
      data.QUESTIONBANKDETAIL_ANSWER,
      data.QUESTIONBANKDETAIL_WEIGHTAGE
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[2].process)
      .input(
        "QUESTIONBANKMASTER_ID",
        sql.Int,
        req.body[0].QUESTIONBANKMASTER_ID
      )
      .input(
        "QUESTIONBANKMASTER_CM_COMP_ID",
        sql.Int,
        req.body[0].QUESTIONBANKMASTER_CM_COMP_ID
      )
      .input(
        "QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID",
        sql.Int,
        req.body[0].QUESTIONBANKMASTER_CATEGORYTOSKILLLEVELID
      )
      .input("QUESTIONBANKMASTER_QUESTIONTYPE", sql.Bit, 1)
      .input(
        "QUESTIONBANKMASTER_QUESTIONTITLE",
        sql.VarChar,
        req.body[0].QUESTIONBANKMASTER_QUESTIONTITLE
      )
      .input("QUESTIONBANKMASTER_TRAININGTRANSACTIONID", sql.Int, "1234")
      .input(
        "QUESTIONBANKMASTER_TRAININGMASTERID",
        sql.Int,
        req.body[0].QUESTIONBANKMASTER_TRAININGMASTERID
      )
      .input(
        "QUESTIONBANKMASTER_MARKS",
        sql.Int,
        req.body[0].QUESTIONBANKMASTER_MARKS
      )
      .input("ES_MODIFY", sql.Int, 0)
      .input("ES_DELETE", sql.Int, 0)
      .input("DETAIL", DT_QUESTIONBANK_DETAIL)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_QuestionBank");

    res.status(200).json(result.output);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

// exports.UPSERT_EmployeeMaster = async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool
//       .request()
//       .input("PROCESS", sql.VarChar, req.body.process)
//       .input("EMP_MASTER_ID", sql.Int, req.body.EMP_MASTER_ID)
//       .input("EMP_MASTER_CM_COMP_ID", sql.Int, req.body.EMP_MASTER_CM_COMP_ID)
//       .input("EMP_MASTER_NUMBER", sql.VarChar, req.body.EMP_MASTER_NUMBER)
//       .input("EMP_MASTER_NAME", sql.VarChar, req.body.EMP_MASTER_NAME)
//       .input(
//         "EMP_MASTER_DEPARTMENT_ID",
//         sql.Int,
//         req.body.EMP_MASTER_DEPARTMENT_ID
//       )
//       .input(
//         "EMP_MASTER_REPORTING_TO",
//         sql.Int,
//         req.body.EMP_MASTER_REPORTING_TO
//       )
//       .input("EMP_MASTER_PROCESS_ID", sql.Int, req.body.EMP_MASTER_PROCESS_ID)
//       .input("EMP_MASTER_EMP_TYPE", sql.Bit, req.body.EMP_MASTER_EMP_TYPE)
//       .input("EMP_MASTER_IS_HOD", sql.Bit, req.body.EMP_MASTER_IS_HOD)
//       .input("ES_MODIFY", sql.Bit, req.body.ES_MODIFY)
//       .input("ES_DELETE", sql.Bit, req.body.ES_DELETE)

//       .output("PK_CODE", sql.VarChar, req.body.PK_CODE)
//       .output("ERROR", sql.VarChar, req.body.ERROR)
//       .execute("UPSERT_EmployeeMaster");
//     console.log(result);
//     res.status(200).json(result.recordset);
//   } catch (error) {
//     res.send(error.message);
//   }
// };

// exports.INSERT_UPSERT_EmployeeMaster = async (req, res) => {
//   console.log(req.body);
//   var DT_EmployeeSkillDetails = new sql.Table();
//   DT_EmployeeSkillDetails.columns.add("EMP_MASTER_SKILLS_ID", sql.Int);
//   DT_EmployeeSkillDetails.columns.add("EMP_MASTER_SKILLS_CATEGORY_ID", sql.Int);
//   DT_EmployeeSkillDetails.columns.add(
//     "EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL",
//     sql.Int
//   );
//   DT_EmployeeSkillDetails.columns.add(
//     "EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL",
//     sql.Int
//   );
//   for (let data of req.body[1]) {
//     DT_EmployeeSkillDetails.rows.add(
//       data.EMP_MASTER_SKILLS_ID,
//       data.EMP_MASTER_SKILLS_CATEGORY_ID,
//       data.EMP_MASTER_SKILLS_PRESENT_SKILLS_LEVEL,
//       data.EMP_MASTER_SKILLS_NEXT_SKILLS_LEVEL
//     );
//   }

//   try {
//     const pool = await poolPromise;
//     const result = await pool
//       .request()
//       .input("PROCESS", sql.VarChar, req.body[2].process)
//       .input("EMP_MASTER_ID", sql.Int, req.body[0].EMP_MASTER_ID)
//       .input(
//         "EMP_MASTER_CM_COMP_ID",
//         sql.Int,
//         req.body[0].EMP_MASTER_CM_COMP_ID
//       )
//       .input("EMP_MASTER_NUMBER", sql.VarChar, req.body[0].EMP_MASTER_NUMBER)
//       .input("EMP_MASTER_NAME", sql.VarChar, req.body[0].EMP_MASTER_NAME)
//       .input(
//         "EMP_MASTER_DEPARTMENT_ID",
//         sql.Int,
//         req.body[0].EMP_MASTER_DEPARTMENT_ID
//       )
//       .input(
//         "EMP_MASTER_REPORTING_TO",
//         sql.Int,
//         req.body[0].EMP_MASTER_REPORTING_TO
//       )
//       .input(
//         "EMP_MASTER_PROCESS_ID",
//         sql.Int,
//         req.body[0].EMP_MASTER_PROCESS_ID
//       )
//       .input("EMP_MASTER_EMP_TYPE", sql.Bit, req.body[0].EMP_MASTER_EMP_TYPE)
//       .input("EMP_MASTER_IS_HOD", sql.Bit, req.body[0].EMP_MASTER_IS_HOD)
//       .input("ES_MODIFY", sql.Bit, 0)
//       .input("ES_DELETE", sql.Bit, 0)
//       .input("DETAIL", DT_EmployeeSkillDetails)
//       .output("PK_CODE", sql.VarChar)
//       .output("ERROR", sql.VarChar)
//       .execute("UPSERT_EmployeeMaster");
//     res.status(200).json(result.recordset);
//   } catch (error) {
//     res.send(error.message);
//   }
// };

exports.UPSERT_TrainingNeedsMaster = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body.process)
      .input("TRAINING_NEED_ID", sql.Int, req.body.TRAINING_NEED_ID)
      .input(
        "TRAINING_NEED_CM_COMP_IND",
        sql.Int,
        req.body.TRAINING_NEED_CM_COMP_IND
      )
      .input("TRAINING_NEED_EMP_CODE", sql.Int, req.body.TRAINING_NEED_EMP_CODE)
      .input(
        "TRAINING_NEED_FROM_DATE",
        sql.DateTime,
        req.body.TRAINING_NEED_FROM_DATE
      )
      .input(
        "TRAINING_NEED_TO_DATE",
        sql.DateTime,
        req.body.TRAINING_NEED_TO_DATE
      )
      .input("ES_MODIFY", sql.Bit, 0)
      .input("ES_DELETE", sql.Bit, 0)

      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_TrainingNeedsMaster");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.INSERT_UPSERT_TrainingNeedsMaster = async (req, res) => {
  var DT_TrainingNeedsDetail = new sql.Table();

  DT_TrainingNeedsDetail.columns.add("TRAINING_NEED_DETAIL_ID", sql.Int);
  DT_TrainingNeedsDetail.columns.add("TRAINING_NEED_PROGRAM_CODE", sql.Int);
  DT_TrainingNeedsDetail.columns.add("TRAINING_NEED_ATTEND", sql.Bit);
  DT_TrainingNeedsDetail.columns.add("TRAINING_NEED_PERCENTAGE", sql.Float);
  DT_TrainingNeedsDetail.columns.add("TRAINING_NEED_REMARKS", sql.VarChar);

  for (let data of req.body[1]) {
    DT_TrainingNeedsDetail.rows.add(
      data.TRAINING_NEED_DETAIL_ID,
      data.TRAINING_NEED_PROGRAM_CODE,
      data.TRAINING_NEED_ATTEND,
      data.TRAINING_NEED_PERCENTAGE,
      data.TRAINING_NEED_REMARKS
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[2].process)
      .input("TRAINING_NEED_ID", sql.Int, req.body[0].TRAINING_NEED_ID)
      .input(
        "TRAINING_NEED_CM_COMP_IND",
        sql.Int,
        req.body[0].TRAINING_NEED_CM_COMP_IND
      )
      .input(
        "TRAINING_NEED_EMP_CODE",
        sql.Int,
        req.body[0].TRAINING_NEED_EMP_CODE
      )
      .input(
        "TRAINING_NEED_FROM_DATE",
        sql.DateTime,
        req.body[0].TRAINING_NEED_FROM_DATE
      )
      .input(
        "TRAINING_NEED_TO_DATE",
        sql.DateTime,
        req.body[0].TRAINING_NEED_TO_DATE
      )
      .input("ES_MODIFY", sql.Bit, 0)
      .input("ES_DELETE", sql.Bit, 0)
      .input("DETAIL", DT_TrainingNeedsDetail)

      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_TrainingNeedsMaster");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.UPSERT_TRAININGPROGRAM_MASTER = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body.process)
      .input("TRAININGPROGRAM_ID", sql.Int, req.body.TRAININGPROGRAM_ID)
      .input(
        "TRAININGPROGRAM_TRAINING_PROGRAM_ID",
        sql.Int,
        req.body.TRAININGPROGRAM_TRAINING_PROGRAM_ID
      )
      .input(
        "TRAININGPROGRAM_CM_COMP_ID",
        sql.Int,
        req.body.TRAININGPROGRAM_CM_COMP_ID
      )
      .input(
        "TRAININGPROGRAM_ID_FROM_DATE",
        sql.DateTime,
        req.body.TRAININGPROGRAM_ID_FROM_DATE
      )
      .input(
        "TRAININGPROGRAM_ID_TO_DATE",
        sql.DateTime,
        req.body.TRAININGPROGRAM_ID_TO_DATE
      )
      .input(
        "TRAININGPROGRAM_ID_PASSING_PERCENTAGE",
        sql.Float,
        req.body.TRAININGPROGRAM_ID_PASSING_PERCENTAGE
      )
      .input("ES_DELETE", sql.Bit, req.body.ES_DELETE)
      .input("ES_MODIFY", sql.Bit, req.body.ES_MODIFY)

      .output("PK_CODE", sql.VarChar, req.body.PK_CODE)
      .output("ERROR", sql.VarChar, req.body.ERROR)
      .execute("UPSERT_TRAININGPROGRAM_MASTER");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};
exports.INSERT_UPSERT_TRAININGPROGRAM_MASTER = async (req, res) => {
  var DT_TRAININGPROGRAM_DETAIL = new sql.Table();
  DT_TRAININGPROGRAM_DETAIL.columns.add(
    "TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID",
    sql.Int
  );
  DT_TRAININGPROGRAM_DETAIL.columns.add(
    "TRAININGPROGRAMDETAIL_EMP_ID",
    sql.Int
  );
  DT_TRAININGPROGRAM_DETAIL.columns.add(
    "TRAININGPROGRAMDETAIL_REQUIRED_FOR_TRAINING",
    sql.Bit
  );

  for (let data of req.body[1]) {
    DT_TRAININGPROGRAM_DETAIL.rows.add(
      data.TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID,
      data.EMP_MASTER_ID,
      data.TRAININGPROGRAMDETAIL_REQUIRED_FOR_TRAINING
    );
  }
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PROCESS", sql.VarChar, req.body[2].process)
      .input("TRAININGPROGRAM_ID", sql.Int, req.body[0].TRAININGPROGRAM_ID)
      .input(
        "TRAININGPROGRAM_TRAINING_PROGRAM_ID",
        sql.Int,
        req.body[0].TRAININGPROGRAM_TRAINING_PROGRAM_ID
      )
      .input(
        "TRAININGPROGRAM_CM_COMP_ID",
        sql.Int,
        req.body[0].TRAININGPROGRAM_CM_COMP_ID
      )
      .input(
        "TRAININGPROGRAM_ID_FROM_DATE",
        sql.DateTime,
        req.body[0].TRAININGPROGRAM_ID_FROM_DATE
      )
      .input(
        "TRAININGPROGRAM_ID_TO_DATE",
        sql.DateTime,
        req.body[0].TRAININGPROGRAM_ID_TO_DATE
      )
      .input(
        "TRAININGPROGRAM_ID_PASSING_PERCENTAGE",
        sql.Float,
        req.body[0].TRAININGPROGRAM_ID_PASSING_PERCENTAGE
      )
      .input("ES_DELETE", sql.Bit, 0)
      .input("ES_MODIFY", sql.Bit, 0)
      .input("DETAIL", DT_TRAININGPROGRAM_DETAIL)
      .output("PK_CODE", sql.VarChar)
      .output("ERROR", sql.VarChar)
      .execute("UPSERT_TRAININGPROGRAM_MASTER");
    res.status(200).json(result.output);
  } catch (error) {
    res.send(error.message);
  }
};
exports.getEmployeeList = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Trainingmaster_id", sql.Int, req.query.Trainingmaster_id)
      .execute("getEmployeeList");
    res.json(result.recordset);
  } catch (error) {
    res.error(error.message);
  }
};

exports.getEmployeeListForApproval = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("EMP_ID", sql.Int, req.query.EMP_ID)
      .input("COMPANY_ID", sql.Int, req.query.COMPANY_ID)
      .execute("GetEmployeeListForApproval");
    res.json(result.recordset);
  } catch (error) {
    res.send(error.message);
  }
};

exports.UpdateApproval = async (req, res) => {
  var DT_UpdateApproval = new sql.Table();
  DT_UpdateApproval.columns.add(
    "TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID",
    sql.Int
  );
  DT_UpdateApproval.columns.add("TRAININGPROGRAMDETAIL_EMP_ID", sql.Int);
  DT_UpdateApproval.columns.add(
    "TRAININGPROGRAMDETAIL_Approved_FOR_TRAINING",
    sql.Bit
  );

  for (let data of req.body) {
    DT_UpdateApproval.rows.add(
      data.TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID,
      data.EMP_MASTER_ID,
      data.TRAININGPROGRAMDETAIL_Approved_FOR_TRAINING
    );
  }
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("DETAIL", DT_UpdateApproval)
      .output("ERROR", sql.VarChar)
      .execute("UpdateApproval");
    res.json(result.recordset);
  } catch (error) {
    res.json(error.message);
  }
};

exports.getEmployeeListForAttendance = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Training_ID", sql.Int, req.query.Training_ID)
      .execute("GetEmployeeListForAttendance");
    res.json(result.recordset);
  } catch (error) {
    res.error(error.message);
  }
};

exports.UpdateAttendance = async (req, res) => {
  var DT_UpdateAttendance = new sql.Table();
  DT_UpdateAttendance.columns.add(
    "TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID",
    sql.Int
  );
  DT_UpdateAttendance.columns.add("TRAININGPROGRAMDETAIL_EMP_ID", sql.Int);
  DT_UpdateAttendance.columns.add(
    "TRAININGPROGRAMDETAIL_Approved_FOR_ATTENDANCE",
    sql.Bit
  );

  for (let data of req.body) {
    DT_UpdateAttendance.rows.add(
      data.TRAININGPROGRAMDETAIL_TRAININGPROGRAM_ID,
      data.EMP_MASTER_ID,
      data.TRAININGPROGRAMDETAIL_ATTENDANCE
    );
  }
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("DETAIL", DT_UpdateAttendance)
      .output("ERROR", sql.VarChar)
      .execute("UpdateUpdateAttendance");
    res.json(result.recordset);
  } catch (error) {
    res.json(error.message);
  }
};

exports.UpdateTraningConductedBy = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("TRAININGPROGRAMID", sql.Int, req.body.TRAININGPROGRAMID)
      .input("CONDUCTEDBY", sql.VarChar, req.body.CONDUCTEDBY)
      .execute("UpdateTraningConductedBy");
    res.json(result.recordset);
  } catch (error) {
    res.json(error.message);
  }
};
exports.getQuestionBank = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("TrainingTransaction_id", sql.Int, req.body.TrainingTransaction_id)
      .input("empid", sql.Int, req.body.emp_id)
      .execute("getQuestionBank");
    res.json(result.recordset);
  } catch (error) {
    res.json(error.message);
  }
};

exports.UPSERT_Eval = async (req, res) => {
  try {
    for (let answer of req.body) {
      var DT_EvalDetail = new sql.Table();
      DT_EvalDetail.columns.add("EVAL_MASTER_ID", sql.Int);
      DT_EvalDetail.columns.add("EVAL_QUESTION_ID", sql.Int);
      DT_EvalDetail.columns.add("EVAL_ANSWER_ID", sql.Int);
      DT_EvalDetail.columns.add("EVAL_SELECTED_ANS", sql.Bit);

      for (let data of answer.DETAIL) {
        DT_EvalDetail.rows.add(
          data.EVAL_MASTER_ID,
          data.EVAL_QUESTION_ID,
          data.EVAL_ANSWER_ID,
          data.EVAL_SELECTED_ANS
        );
      }
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("PROCESS", sql.VarChar, answer.PROCESS)
        .input("EVAL_ID", sql.Int, answer.EVAL_ID)
        .input("EVAL_CM_COMP_ID", sql.Int, answer.EVAL_CM_COMP_ID)
        .input("EVAL_DATE", sql.Date, answer.EVAL_DATE)
        .input(
          "EVAL_TRAINING_SCHEDULE_ID",
          sql.Int,
          answer.EVAL_TRAINING_SCHEDULE_ID
        )
        .input("EVAL_EMP_ID", sql.Int, answer.EVAL_EMP_ID)
        .input("EVAL_TOTAL_MARKS", sql.Int, answer.EVAL_TOTAL_MARKS)
        .input("ES_DELETE", sql.Bit, answer.ES_DELETE)
        .input("MODIFY", sql.Bit, answer.MODIFY)
        .input("DETAIL", DT_EvalDetail)
        .output("PK_CODE", sql.VarChar)
        .output("ERROR", sql.VarChar)
        .execute("UPSERT_Eval");
    }
    res.status(200).json({ message: "Successfully completed" });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

exports.UPSERT_EvalOffline = async (req, res) => {
  try {
    for (let answer of req.body) {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("PROCESS", sql.VarChar, answer.PROCESS)
        .input("EVAL_ID", sql.Int, answer.EVAL_ID)
        .input("EVAL_CM_COMP_ID", sql.Int, answer.EVAL_CM_COMP_ID)
        .input("EVAL_DATE", sql.Date, answer.EVAL_DATE)
        .input(
          "EVAL_TRAINING_SCHEDULE_ID",
          sql.Int,
          answer.EVAL_TRAINING_SCHEDULE_ID
        )
        .input("EVAL_EMP_ID", sql.Int, answer.EVAL_EMP_ID)
        .input("EVAL_TOTAL_MARKS", sql.Int, answer.EVAL_TOTAL_MARKS)
        .input("ES_DELETE", sql.Bit, answer.ES_DELETE)
        .input("MODIFY", sql.Bit, answer.MODIFY)
        .output("PK_CODE", sql.VarChar)
        .output("ERROR", sql.VarChar)
        .execute("UPSERT_EvalOffline");
    }
    res.status(200).json({ message: "Successfully completed" });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

exports.getEmployeeListForOfflineEvaluation = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("TrainingScheduleID", sql.Int, req.body.Trainingmaster_id)
      .input("COMPANY_ID", sql.Int, req.body.COMPANY_ID)
      .execute("GetEmployeeListForOfflineEvaluation");
    res.json(result.recordset);
  } catch (error) {
    res.json(error.message);
  }
};
