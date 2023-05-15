import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import router from "./routes";
import cors from "cors";
const connection = require("./db");
const app = express();
connection();
app.get("/", (req, res) => {
  res.send("Task API");
});

app.use(cors({ origin: "*" }));
app.use(compression());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/", router);

app.use(function (req, res, next) {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "access-control-allow-headers": "*",
    "Access-Control-Allow-Methods": "*",
  });
  next();
});

export default app;
