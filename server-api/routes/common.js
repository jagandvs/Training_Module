const express = require("express");

const { isSignedIn } = require("../controller/auth");
const {
  TableResponse,
  setResetModify,
  deleteRow,
  SP_CM_FillCombo,
  logger,
  upload,
  getListFiles,
  deleteFile,
  downloadFile,
} = require("../controller/common");

const router = express.Router();

router.post("/TableResponse", isSignedIn, TableResponse);
router.post("/setResetModify", isSignedIn, setResetModify);
router.post("/deleteRow", isSignedIn, logger, deleteRow);
router.post("/SP_CM_FillCombo", SP_CM_FillCombo);
router.post("/upload", upload);
router.get("/getListFiles", getListFiles);
router.post("/deleteFile", deleteFile);
router.get("/downloadFile", downloadFile);

module.exports = router;
