const express = require('express');
const router = express.Router();
const car = require('../models/car');
const user = require('../models/users');
const hire = require('../models/carHire');

router.get('/add', (req, res) => {
     res.render('addHire.ejs');
});

router.post('/add', async (req, res) => {

     if (new Date(req.body.date) <= new Date() || req.body.date == null)
          return res.render('addHire.ejs', {
               message: "Popraw datę"
          });

     try {

          const carTemp = await car.findOne({
               plate: req.body.plate
          });

          const hireExist = await hire.findOne({
               status: 'aktywne',
               car: carTemp._id
          });
          if (hireExist == null) {
               const userTemp = await user.findOne({
                    login: req.body.user
               });

               if (userTemp == null) {
                    res.render('addHire.ejs', {
                         message: "Nie ma takiego użytkownika"
                    });
               } else if (carTemp == null) {
                    res.render('addHire.ejs', {
                         message: "Nie ma takiego samochodu"
                    });
               } else {
                    const newHire = new hire({
                         user: userTemp._id,
                         car: carTemp._id,
                         plannedDate: req.body.date
                    });
                    await newHire.save();
                    res.render('addHire.ejs', {
                         message: "Dodano"
                    });
               }
          } else {
               res.render('addHire.ejs', {
                    message: "Ten samochód jest wypożyczony."
               });
          }

     } catch (e) {
          res.render('addHire.ejs', {
               message: e
          });
     }
});

module.exports = router;