require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { sql, poolPromise } = require("./database/db");

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(
  path.join(__dirname, "/logs/access.log"),
  { flags: "a" }
);

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) console.log("Unable to start the server!");
  else console.log("Server started running on : " + port);
});
