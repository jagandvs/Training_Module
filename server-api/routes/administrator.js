const express = require("express");
const {
  UPSERT_USER_MASTER,
  getModule,
  insertUserRights,
  userMaster,
  getScreen,
  userRight,
} = require("../controller/administrator/userMaster");

const { signin, isSignedIn } = require("../controller/auth");
const { logger, TableResponse } = require("../controller/common");

const router = express.Router();

// user Master
router.post("/UPSERT_USER_MASTER", isSignedIn, UPSERT_USER_MASTER);

router.get("/userMaster", isSignedIn, userMaster);
router.get("/getModule", isSignedIn, getModule);
router.get("/getScreen", isSignedIn, getScreen);
router.post("/userRight", isSignedIn, userRight);
router.post("/insertUserRights", isSignedIn, logger, insertUserRights);

module.exports = router;
