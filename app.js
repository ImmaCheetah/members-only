require('dotenv').config();

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

// Packages
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require("node:path");
const pool = require('./db/pool');
const LocalStrategy = require('passport-local').Strategy;
const pgStore = require('connect-pg-simple')(session);

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Path to css file
const assetsPath = path.join(__dirname, "/public");

// Routers
const indexRouter = require('./routes/indexRouter')
const messageRouter = require('./routes/messageRouter')

const sessionStore = new pgStore({pool: pool})

app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SECRET,
  resave: false, 
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}))

app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use('/', indexRouter);
app.use('/messages', messageRouter);

app.listen(process.env.PORT, () => console.log('App running on port', PORT));