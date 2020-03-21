const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Use passport for the auth
passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  (username, password, done) => {
    User.findOne({email: username}, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, {
          message: 'Incorrect email or password'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect email or password'
        });
      };
      return done(null, user);
    });
  }

));