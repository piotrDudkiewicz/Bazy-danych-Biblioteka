const express = require('express');
const passport = require('passport')
const router = express.Router();
const user = require('../models/users');

require("../config/passportConfig")(router);



router.post('/register', function (req, res) {

     if (req.body.password != req.body.password2) {
          return res.render("register.ejs", {
               message: "Hasła nie są takie same"
          });
     }
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
     }).catch(e => {
          if (e.message) {
               res.render("register.ejs", {
                    message: e.message
               });
          } else {
               res.render("register.ejs", {
                    message: "Coś poszło nie tak"
               });
          }
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
               return res.render('login.ejs', {
                    message: "Błędne dane"
               });
          }
          req.logIn(user, function (err) {
               return res.redirect('/home');
          });
     })(req, res, next);
});

router.get("/logout", async function (req, res) {
     try {
          req.logOut();
          res.redirect("/home");
     } catch (err) {
          res.redirect("/home");
     }
})

module.exports = router