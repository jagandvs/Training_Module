const express = require("express");

const { signin, isSignedIn } = require("../controller/auth");

const { logger, TableResponse } = require("../controller/common");
const {
  UPSERT_QuestionBank,
  INSERT_UPSERT_QuestionBank,
  UPSERT_TrainingNeedsMaster,
  INSERT_UPSERT_TrainingNeedsMaster,

  getEmployeeList,
  UPSERT_TRAININGPROGRAM_MASTER,
  INSERT_UPSERT_TRAININGPROGRAM_MASTER,
  getEmployeeListForApproval,
  UpdateApproval,
  UpdateAttendance,
  getEmployeeListForAttendance,
  getQuestionBank,
  UPSERT_Eval,
  UPSERT_EvalOffline,
  getEmployeeListForOfflineEvaluation,
  UpdateTraningConductedBy,
} = require("../controller/transactions/transactions");

const router = express.Router();

router.post("/UPSERT_QuestionBank", isSignedIn, UPSERT_QuestionBank);
router.post(
  "/INSERT_UPSERT_QuestionBank",
  isSignedIn,
  logger,
  INSERT_UPSERT_QuestionBank
);

router.post(
  "/UPSERT_TrainingNeedsMaster",
  isSignedIn,
  UPSERT_TrainingNeedsMaster
);
router.post(
  "/INSERT_UPSERT_TrainingNeedsMaster",
  isSignedIn,
  logger,
  INSERT_UPSERT_TrainingNeedsMaster
);

router.post(
  "/UPSERT_TRAININGPROGRAM_MASTER",
  isSignedIn,
  UPSERT_TRAININGPROGRAM_MASTER
);

router.post(
  "/INSERT_UPSERT_TRAININGPROGRAM_MASTER",
  isSignedIn,
  logger,
  INSERT_UPSERT_TRAININGPROGRAM_MASTER
);

router.get("/getEmployeeList", isSignedIn, getEmployeeList);
router.get(
  "/getEmployeeListForApproval",
  isSignedIn,
  getEmployeeListForApproval
);
router.post("/UpdateApproval", isSignedIn, logger, UpdateApproval);

router.get(
  "/getEmployeeListForAttendance",
  isSignedIn,
  getEmployeeListForAttendance
);
router.post("/UpdateAttendance", isSignedIn, logger, UpdateAttendance);
router.post(
  "/UpdateTraningConductedBy",
  isSignedIn,
  logger,
  UpdateTraningConductedBy
);
router.post("/getQuestionBank", getQuestionBank);
router.post("/UPSERT_Eval", isSignedIn, logger, UPSERT_Eval);
router.post(
  "/getEmployeeListForOfflineEvaluation",
  isSignedIn,
  getEmployeeListForOfflineEvaluation
);
router.post("/UPSERT_EvalOffline", isSignedIn, logger, UPSERT_EvalOffline);

module.exports = router;
