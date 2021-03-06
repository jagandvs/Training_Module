require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { sql, poolPromise } = require("./database/db");
const authRouter = require("./routes/auth");
const commonRouter = require("./routes/common");
const mastersRouter = require("./routes/masters");
const transactionsRouter = require("./routes/transactions");
const reportsRouter = require("./routes/reports");

const administratorRouter = require("./routes/administrator");

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
global.__basedir = __dirname;
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/auth", authRouter);
app.use("/api/administrator", administratorRouter);
app.use("/api/common", commonRouter);
app.use("/api/masters", mastersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/reports", reportsRouter);

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) console.log("Unable to start the server!");
  else console.log("Server started running on : " + port);
});
