const express = require("express");
const parser = require('cookie-parser')
const app = express();
exports.app = app;
const path = require("path");
const baseRouter = require("./routes/index");
require("./database");
app.use(express.json());
app.use(parser())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./dist")));

require("./config/jwt.config");
app.use("/api", baseRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

app.listen(3000);
