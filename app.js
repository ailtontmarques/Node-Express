const express = require('express');
const bodyParse = require('body-parser');

const personRoutes = require('./routes/personRoutes');

const app = express();

app.use(bodyParse.urlencoded({ extended: false }));

personRoutes(app);

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });
  
module.exports = app;