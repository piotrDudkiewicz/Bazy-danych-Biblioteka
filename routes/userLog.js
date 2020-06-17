const express = require('express');
const router = express.Router();
const servicePanel = require('./servicePanel');
const user = require('../models/users');
const car = require('../models/car');
const hire = require('../models/carHire');
const allModels = require('../config/lib');
const ObjectId = require('mongoose').Types.ObjectId;


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
     res.render("home.ejs", {
          page: 'Home',
          menuId: 'home',
          isLoggedIn: req.isAuthenticated(),
          userType: req.user.type
     });
});

router.get('/panel', (req, res) => {
     switch (req.body.type) {
          case "client":
               res.render("clientPanel.ejs", {
                    page: 'Panel klienta',
                    menuId: 'clientPanel',
                    isLoggedIn: req.isAuthenticated()
               });
               break;
          case "service":
               res.render('servicePanel.ejs', {
                    page: 'Panel administratora',
                    menuId: 'servicePanel',
                    isLoggedIn: req.isAuthenticated()
               });
               break;
          default:
               res.redirect('/home');
     }
});

router.get('/list', async (req, res) => {
     let manufacturerList, modelList;
     try {
          let populate = {
               path: 'car',
               populate: {
                    path: 'manufacturer'
               }
          };

          let sortOptions = {}

          let aggregateOption = [{
               $lookup: {
                    from: "carmodels",
                    localField: "car",
                    foreignField: "_id",
                    as: "model"
               }
          }, {
               $unwind: {
                    path: "$model",
                    preserveNullAndEmptyArrays: true
               }
          }, {
               $lookup: {
                    from: "carmanufacturers",
                    localField: "model.manufacturer",
                    foreignField: "_id",
                    as: "manufacturer",
               }
          }, {
               $unwind: {
                    path: "$manufacturer",
                    preserveNullAndEmptyArrays: true
               }
          }];

          if (req.query.powerFrom) {
               aggregateOption[aggregateOption.length] = {
                    $match: {
                         enginePower: {
                              $gte: Number(req.query.powerFrom)
                         }
                    }
               };
          }

          if (req.query.powerTo) {
               aggregateOption[aggregateOption.length] = {
                    $match: {
                         enginePower: {
                              $lte: Number(req.query.powerTo)
                         }
                    }
               };
          }

          if (req.query.priceFrom) {
               aggregateOption[aggregateOption.length] = {
                    $match: {
                         "pricePerDay": {
                              $gte: Number(req.query.priceFrom)
                         }
                    }
               };
          }

          if (req.query.priceTo) {
               aggregateOption[aggregateOption.length] = {
                    $match: {
                         pricePerDay: {
                              $lte: Number(req.query.priceTo)
                         }
                    }
               };
          }

          if (req.query.manufacturer) {
               modelList = await allModels.models(req.query.manufacturer);
               aggregateOption[aggregateOption.length] = {
                    $match: {
                         "manufacturer._id": {
                              $eq: ObjectId(req.query.manufacturer)
                         }
                    }
               };
          }

          if (req.query.model && req.query.manufacturer) {
               aggregateOption[aggregateOption.length] = {
                    $match: {
                         "model._id": {
                              $eq: ObjectId(req.query.model)
                         }
                    }
               };
          }

          if (req.query.sortOption) {
               switch (req.query.sortOption) {
                    case "0":
                         aggregateOption[aggregateOption.length] = {
                              $sort: {
                                   pricePerDay: 1
                              }
                         };
                         break;
                    case "1":
                         aggregateOption[aggregateOption.length] = {
                              $sort: {
                                   pricePerDay: -1
                              }
                         };
                         break;
                    case "2":
                         aggregateOption[aggregateOption.length] = {
                              $sort: {
                                   enginePower: 1
                              }
                         };
                         break;
                    case "3":
                         aggregateOption[aggregateOption.length] = {
                              $sort: {
                                   enginePower: -1
                              }
                         };
                         break;
               }
          }

          const cars = await car.aggregate(aggregateOption);

          manufacturerList = await allModels.manufacturers();

          res.render('listCar.ejs', {
               cars: cars,
               manufacturers: manufacturerList,
               models: modelList,
               manufacturer: req.query.manufacturer,
               model: req.query.model,
               edit: req.body.type == "service" ? true : false,
               page: 'Lista samochodów',
               menuId: 'listCar',
               isLoggedIn: req.isAuthenticated()
          });
     } catch (e) {
          res.render('listCar.ejs', {
               cars: e,
               manufacturers: manufacturerList,
               models: modelList,
               manufacturer: req.query.manufacturer,
               model: req.query.model,
               page: 'Lista samochodów',
               menuId: 'listCar',
               isLoggedIn: req.isAuthenticated()
          });
     }

});

router.get('/panel/client/hire/getAll', async (req, res) => {
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
               type: 'client',
               page: 'Lista wypożyczeń',
               menuId: 'hireList',
               isLoggedIn: req.isAuthenticated()
          });


     } catch (e) {
          res.render('getHireList.ejs', {
               message: "Coś poszło nie tak",
               manufacturers: manufacturerList,
               models: modelList,
               manufacturer: req.query.manufacturer,
               model: req.query.model,
               page: 'Lista wypożyczeń',
               menuId: 'hireList',
               isLoggedIn: req.isAuthenticated()
          });
     }
});

router.use('/panel/service', servicePanel);

module.exports = router;