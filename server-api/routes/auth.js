const express = require("express");

const { signin, getUserEmployeeCode } = require("../controller/auth");
const { logger, TableResponse } = require("../controller/common");

const router = express.Router();

router.post("/getCompanyDetails", TableResponse);
router.post("/signin", signin);

router.get("/getUserEmployeeCode", getUserEmployeeCode);

module.exports = router;
