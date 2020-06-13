const express = require('express');
const router = express.Router();
const car = require('../models/car');
const user = require('../models/users');
const hire = require('../models/carHire');
const allModels = require('../config/lib');

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

router.get('/getAll', async (req, res) => {
     let manufacturerList, modelList;
     try {

          manufacturerList = await allModels.manufacturers();

          if (req.query.manufacturer) {
               modelList = await allModels.models(req.query.manufacturer);
          }

          const aggregateOption = await allModels.hiresAggregate(req);
          const hires = await hire.aggregate(aggregateOption);

          res.render('getHireList.ejs', {
               hires: hires,
               manufacturers: manufacturerList,
               models: modelList,
               manufacturers: manufacturerList,
               manufacturer: req.query.manufacturer,
               model: req.query.model,
               type: "service"
          });


     } catch (e) {
          res.render('getHireList.ejs', {
               message: "Coś poszło nie tak",
               manufacturers: manufacturerList,
               models: modelList,
               manufacturer: req.query.manufacturer,
               model: req.query.model
          });
     }
});

router.get('/end/:id', async (req, res) => {
     try {
          let hireTemp = await hire.updateOne({
               _id: req.params.id
          }, {
               status: 'zakonczone'
          });

          hireTemp = await hire.findOne({
               _id: req.params.id
          });

          res.render('getHireList.ejs', {
               message: "Do zapłaty: " + hireTemp.price
          });
     } catch (e) {
          res.render('getHireList.ejs', {
               message: "Coś poszło nie tak "
          });
     }
});
module.exports = router;