const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const customFields = {
  usernameField: 'email',
  passwordField: 'password'
}

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [username]);
    const user = rows[0];
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return done(null, user);
    } else {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" })
    }

  } catch (error) {   
      return done(error)
  }
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);
  
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});