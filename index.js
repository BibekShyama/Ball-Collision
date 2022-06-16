const path = require("path");
const express = require("express");
const app = express();
let port = 8000;

// console.log(path.join(__dirname, "public"));
const staticPath = path.join(__dirname, "public");

app.use(express.static(staticPath));

app.listen(port, () => {
  console.log(`listening the port at ${port}`);
});
