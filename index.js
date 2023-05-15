const http = require("http");
const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(3000, () => console.log("Server is running in port 3000"));