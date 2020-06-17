const express = require('express');
const router = express.Router();
const manufacturer = require('../models/carManufacturers');
const model = require('../models/carModel');
const car = require('../models/car');
const allModels = require('../config/lib');

router.get("/model/add", (req, res) => {
     res.render("addModel.ejs",{
     page:'Dodaj model',
     menuId:'addModel',
     isLoggedIn: req.isAuthenticated()
   });
});

router.post("/model/add", async (req, res) => {

     try {
          let manu = await manufacturer.findOne({
               name: req.body.manu
          });

          if (manu == null) {
               const temp = new manufacturer({
                    name: req.body.manu
               });
               manu = await temp.save();
          }


          let existCar = await model.findOne({
               name: req.body.model,
               manufacturer: manu._id
          });

          if (existCar == null) {
               manu = new model({
                    name: req.body.model,
                    manufacturer: manu._id
               });
               await manu.save();
               res.render("addModel.ejs", {
                    message: "Dodano",
                    page:'Dodaj model',
                    menuId:'addModel',
                    isLoggedIn: req.isAuthenticated()
               });
          } else {
               res.render("addModel.ejs", {
                    message: "Ten pojazd już istnieje",
                    page:'Dodaj model',
                    menuId:'addModel',
                    isLoggedIn: req.isAuthenticated()
               });
          }

     } catch (e) {
          if (e.message) {
               res.render("addModel.ejs", {
                    message: e.message,
                    page:'Dodaj model',
                    menuId:'addModel',
                    isLoggedIn: req.isAuthenticated()
               });
          } else {
               res.render("addModel.ejs", {
                    message: "Coś poszło nie tak",
                    page:'Dodaj model',
                    menuId:'addModel',
                    isLoggedIn: req.isAuthenticated()
               });
          }

     }
});

router.get('/specimen/add', async (req, res) => {

     const modelList = await allModels.modelsAndManu();

     res.render('addCar.ejs', {
          models: modelList,
          loc: 'add',
          page:'Dodaj model',
          menuId:'addModel',
          isLoggedIn: req.isAuthenticated()
     });
});

router.post('/specimen/add', async (req, res) => {
     const modelList = await allModels.modelsAndManu();
     try {
          const carTemp = new car({
               plate: req.body.plate,
               car: req.body.car,
               enginePower: req.body.enginePower,
               engineSize: req.body.engineSize,
               color: req.body.color,
               productionYear: req.body.productionYear,
               pricePerDay: req.body.pricePerDay
          });

          await carTemp.save();

          res.render("addCar.ejs", {
               message: "Dodano",
               models: modelList,
               loc: 'add',
               page:'Dodaj model',
               menuId:'addModel',
               isLoggedIn: req.isAuthenticated()
          });
     } catch (e) {

          if (e.message) {
               res.render("addCar.ejs", {
                    message: e.message,
                    models: modelList,
                    loc: 'add',
                    page:'Dodaj model',
                    menuId:'addModel',
                    isLoggedIn: req.isAuthenticated()
               });
          } else {
               res.render("addCar.ejs", {
                    message: "Coś poszło nie tak",
                    models: modelList,
                    loc: 'add',
                    page:'Dodaj model',
                    menuId:'addModel',
                    isLoggedIn: req.isAuthenticated()
               });
          }
     }
});

router.get('/specimen/edit/:id', async (req, res) => {
     let modelList, carSpecimen;
     try {
          modelList = await allModels.modelsAndManu();
          carSpecimen = await car.findById(req.params.id);
          res.render("addCar.ejs", {
               models: modelList,
               loc: 'edit',
               car: carSpecimen,
               page:'Edytuj model',
               menuId:'edit',
               isLoggedIn: req.isAuthenticated()
          });
     } catch (e) {
          res.render("addCar.ejs", {
               models: modelList,
               loc: 'edit',
               car: carSpecimen,
               message: "Coś poszło nie tak",
               page:'Edytuj model',
               menuId:'edit',
               isLoggedIn: req.isAuthenticated()
          });
     }

});

router.post('/specimen/edit/', async (req, res) => {
     let modelList, carSpecimen;
     try {
          modelList = await allModels.modelsAndManu();
          carSpecimen = await car.findById(req.body.specimenId);

          let result = await car.updateOne({
               _id: req.body.specimenId
          }, {
               plate: req.body.plate,
               car: req.body.car,
               enginePower: req.body.enginePower,
               engineSize: req.body.engineSize,
               color: req.body.color,
               productionYear: req.body.productionYear,
               pricePerDay: req.body.pricePerDay
          }, {
               runValidators: true
          });

          res.render("addCar.ejs", {
               models: modelList,
               loc: 'edit',
               car: carSpecimen,
               message: "Zaktualizowano",
               page:'Edytuj model',
               menuId:'editModel',
               isLoggedIn: req.isAuthenticated()
          });
     } catch (e) {
          console.log(e)
          if (e.message) {
               return res.render("addCar.ejs", {
                    message: e.message,
                    car: carSpecimen,
                    models: modelList,
                    loc: 'edit',
                    page:'Edytuj model',
                    menuId:'editModel',
                    isLoggedIn: req.isAuthenticated()
               });
          }
          res.render("addCar.ejs", {
               message: "Coś poszło nie tak",
               models: modelList,
               car: carSpecimen,
               loc: 'edit',
               page:'Edytuj model',
               menuId:'editModel',
               isLoggedIn: req.isAuthenticated()
          });

     }

});

module.exports = router;
