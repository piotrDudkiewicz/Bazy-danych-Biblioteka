const express = require('express');
const passport = require('passport')
const router = express.Router();
const user = require('../models/users');

require("../config/passportConfig")(router);



router.post('/register', function (req, res) {

     const newUser = new user({
          login: req.body.login,
          name: req.body.name,
          surname: req.body.surname,
          type: "client",
          password: req.body.password,
          email: req.body.email
     });

     newUser.save().then(result => {
          res.redirect('/user/login');
     }).catch(err => {
          res.redirect('/user/register');
     });

});

router.get("/login", (req, res) => {
     res.render("login.ejs");
});

router.get("/register", (req, res) => {
     res.render("register.ejs");
});

router.post('/login', async function (req, res, next) {
     passport.authenticate('local', function (err, user, info) {
          if (err) {
               return next(err);
          }
          if (!user) {
               res.redirect('/user/login');
          }
          req.logIn(user, function (err) {
               res.redirect('/home');
          });
     })(req, res, next);
});

router.post("/logout", async function (req, res) {
     try {
          req.logOut();
          res.status(200).json({
               message: "Success"
          });
     } catch (err) {
          res.status(500).json(err);
     }
})

module.exports = router