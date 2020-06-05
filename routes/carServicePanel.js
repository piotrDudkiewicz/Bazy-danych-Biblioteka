const express = require('express');
const router = express.Router();
const manufacturer = require('../models/carManufacturers');
const model = require('../models/carModel');
const car = require('../models/car');

async function allModels() {
     try {
          const result = await model.find().select("-__v").populate("manufacturer", "name");
          return result;
     } catch (e) {
          return null;
     }
}

router.get("/model/add", (req, res) => {
     res.render("addModel.ejs");
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
                    message: "Dodano"
               })
          } else {
               res.render("addModel.ejs", {
                    message: "Ten pojazd już istnieje"
               })
          }

     } catch (e) {
          if (e.message) {
               res.render("addModel.ejs", {
                    message: e.message
               });
          } else {
               res.render("addModel.ejs", {
                    message: "Coś poszło nie tak"
               });
          }

     }
});

router.get('/specimen/add', async (req, res) => {

     const modelList = await allModels();

     res.render('addCar.ejs', {
          models: modelList
     });
});

router.post('/specimen/add', async (req, res) => {
     const modelList = await allModels();
     try {
          const carTemp = new car({
               plate: req.body.plate,
               car: req.body.car,
               enginePower: req.body.enginePower,
               engineSize: req.body.engineSize,
               color: req.body.color,
               productionYear: req.body.productionYear
          });

          await carTemp.save();

          res.render("addCar.ejs", {
               message: "Dodano",
               models: modelList
          });
     } catch (e) {

          if (e.message) {
               res.render("addCar.ejs", {
                    message: e.message,
                    models: modelList
               });
          } else {
               res.render("addCar.ejs", {
                    message: "Coś poszło nie tak",
                    models: modelList
               });
          }
     }
});

module.exports = router;