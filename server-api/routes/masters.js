const express = require("express");

const { signin, isSignedIn } = require("../controller/auth");

const { logger, TableResponse } = require("../controller/common");
const {
  UPSERT_category_master,
  UPSERT_CategoryToSkillLevel_Master,
  UPSERT_customer_master,
  UPSERT_department_master,
  UPSERT_process_master,
  UPSERT_StudyMaterialMaster,
  UPSERT_TrainingProgramMaster,
  UPSERT_EmployeeMaster,
  INSERT_UPSERT_EmployeeMaster,
} = require("../controller/masters/masters");

const router = express.Router();

router.post(
  "/UPSERT_category_master",
  isSignedIn,
  logger,
  UPSERT_category_master
);
router.post(
  "/UPSERT_CategoryToSkillLevel_Master",
  isSignedIn,
  logger,
  UPSERT_CategoryToSkillLevel_Master
);
router.post(
  "/UPSERT_customer_master",
  isSignedIn,
  logger,
  UPSERT_customer_master
);

router.post(
  "/UPSERT_department_master",
  isSignedIn,
  logger,
  UPSERT_department_master
);

router.post(
  "/UPSERT_process_master",
  isSignedIn,
  logger,
  UPSERT_process_master
);

router.post(
  "/UPSERT_StudyMaterialMaster",
  isSignedIn,
  logger,
  UPSERT_StudyMaterialMaster
);

router.post(
  "/UPSERT_TrainingProgramMaster",
  isSignedIn,
  logger,
  UPSERT_TrainingProgramMaster
);

router.post("/UPSERT_EmployeeMaster", UPSERT_EmployeeMaster);
router.post(
  "/INSERT_UPSERT_EmployeeMaster",
  isSignedIn,
  logger,
  INSERT_UPSERT_EmployeeMaster
);

module.exports = router;
