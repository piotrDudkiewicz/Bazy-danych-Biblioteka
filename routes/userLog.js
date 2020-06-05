const express = require('express');
const router = express.Router();
const servicePanel = require('./servicePanel');
const user = require('../models/users');

router.use(async function (req, res, next) {
     try {
          if (req.isAuthenticated()) {
               const userTemp = await user.findById(req.session.passport.user);
               if (userTemp != null) {
                    req.body.type = userTemp.type;
                    return next();
               }
          }
          res.redirect("/");
     } catch (e) {
          res.redirect("/home");
     }
});

router.get("/home", (req, res) => {
     res.render("home.ejs");
});

router.get('/panel', (req, res) => {
     switch (req.body.type) {
          case "cilent":
               res.redirect('/panel/client');
               break;
          case "service":
               res.render('servicePanel.ejs');
               break;
          default:
               res.redirect('/home');
     }
});

router.get('/list', async (req, res) => {
     try {
          const cars = await car.find({})
               .populate({
                    path: 'car',
                    populate: {
                         path: 'manufacturer'
                    }
               });
          res.render('listCar.ejs', {
               cars: cars
          });
     } catch (e) {
          res.render('listCar.ejs', {
               cars: null
          });
     }

});

router.use('/panel/service', servicePanel);

module.exports = router;