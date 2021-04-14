const express = require("express");

const { signin, isSignedIn } = require("../controller/auth");
const {
  getEmployeeHistoryCard,
  getEmployeeHistoryCardofEmployee,
  getpresentskills,
  getTRAININGNEEDS,
  getTRAININGCALENDER,
} = require("../controller/reports/reports");

const router = express.Router();

router.post("/getEmployeeHistoryCard", isSignedIn, getEmployeeHistoryCard);
router.post(
  "/getEmployeeHistoryCardofEmployee",
  isSignedIn,
  getEmployeeHistoryCardofEmployee
);

router.post("/getpresentskills", isSignedIn, getpresentskills);
router.post("/getTRAININGNEEDS", isSignedIn, getTRAININGNEEDS);
router.post("/getTRAININGCALENDER", isSignedIn, getTRAININGCALENDER);

module.exports = router;
