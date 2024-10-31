require('dotenv').config();

// Packages
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;

// Path to css file
const assetsPath = path.join(__dirname, "/public");

// Routers
const indexRouter = require('./routes/indexRouter')
const messageRouter = require('./routes/messageRouter')

app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use('/', indexRouter);


app.listen(process.env.PORT, () => console.log('App running on port', PORT));