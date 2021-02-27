const express = require("express");

const { isSignedIn } = require("../controller/auth");
const {
  TableResponse,
  setResetModify,
  deleteRow,
  SP_CM_FillCombo,
} = require("../controller/common");

const router = express.Router();

router.post("/TableResponse", isSignedIn, TableResponse);
router.post("/setResetModify", isSignedIn, setResetModify);
router.post("/deleteRow", isSignedIn, deleteRow);
router.post("/SP_CM_FillCombo", SP_CM_FillCombo);
module.exports = router;
