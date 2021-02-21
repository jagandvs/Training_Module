const express = require("express");

const { signin } = require("../controller/auth");
const { logger, TableResponse } = require("../controller/_helper");

const router = express.Router();

router.post("/getCompanyDetails", TableResponse);
router.post("/signin", signin);

module.exports = router;
