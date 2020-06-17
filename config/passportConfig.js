const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const user = require('../models/users');

const authenticateUser = async (username, password, done) => {
     try {
          user.findOne({
               login: username
          }).then(userTemp => {
               bcrypt.compare(password, userTemp.password).then((result) => {
                    if (result)
                         return done(null, userTemp);
                    return done(null, false, {
                         message: 'Incorrect password'
                    });
               }).catch((err) => {
                    throw err;
               });

          }).catch(err => {
               return done(null, false, {
                    message: 'No user with that login'
               });
          });

     } catch (e) {
          return done(e);
     }
}



module.exports = function (app) {
     app.use(passport.initialize());
     app.use(passport.session());

     passport.use(new LocalStrategy({
               usernameField: 'login',
               passwordField: 'password'
          },
          authenticateUser
     ));
     passport.serializeUser((user, done) => done(null, user._id));
     passport.deserializeUser((id, done) => {
          user.findById(id).then(userTemp => {
               return done(null, userTemp);
          });
     });

};
