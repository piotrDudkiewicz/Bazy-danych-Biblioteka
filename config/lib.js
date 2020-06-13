const model = require('../models/carModel');
const manufacturer = require('../models/carManufacturers');
const hire = require('../models/carHire');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
     modelsAndManu: async function () {
          try {
               const result = await model.find().select("-__v").populate("manufacturer", "name");
               return result;
          } catch (e) {
               return null;
          }
     },
     manufacturers: async function () {
          try {
               const result = await manufacturer.find().select("-__v");
               return result;
          } catch (e) {
               return null;
          }
     },
     models: async function (manu) {
          try {
               const result = await model.find({
                    manufacturer: manu
               }).select("-__v");
               return result;
          } catch (e) {
               return null;
          }
     },
     hiresAggregate: async function (req) {
          try {
               let aggregateOption = [{
                    $lookup: {
                         from: "cars",
                         localField: "car",
                         foreignField: "_id",
                         as: "carSpecimen"
                    }
               }, {
                    $unwind: {
                         path: "$carSpecimen",
                         preserveNullAndEmptyArrays: true
                    }
               }, {
                    $lookup: {
                         from: "carmodels",
                         localField: "carSpecimen.car",
                         foreignField: "_id",
                         as: "model",
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
               }, {
                    $lookup: {
                         from: "users",
                         localField: "user",
                         foreignField: "_id",
                         as: "userOn",
                    }
               }, {
                    $unwind: {
                         path: "$userOn",
                         preserveNullAndEmptyArrays: true
                    }
               }, {
                    $project: {
                         "userOn.login": 1,
                         price: 1,
                         startDate: 1,
                         endDate: 1,
                         plannedDate: 1,
                         status: 1,
                         "carSpecimen.plate": 1,
                         "model.name": 1,
                         "manufacturer.name": 1,
                         "model._id": 1,
                         "manufacturer._id": 1,
                         "carSpecimen.pricePerDay": 1
                    }
               }];

               if (req.query.plate) {
                    aggregateOption[aggregateOption.length] = {
                         $match: {
                              "carSpecimen.plate": {
                                   $regex: "^" + req.query.plate
                              }
                         }
                    };
               }

               if (req.body.type == "client") {

                    if (req.query.status) {
                         aggregateOption[aggregateOption.length] = {
                              $match: {
                                   "user._if": {
                                        $eq: ObjectId(req.session.passport.user)
                                   }
                              }
                         };
                    }
               }

               if (req.query.status) {
                    aggregateOption[aggregateOption.length] = {
                         $match: {
                              "status": {
                                   $eq: req.query.status
                              }
                         }
                    };
               }

               if (req.query.dateFrom) {
                    aggregateOption[aggregateOption.length] = {
                         $match: {
                              "startDate": {
                                   $gte: new Date(req.query.dateFrom)
                              }
                         }
                    };
               }

               if (req.query.dateTo) {
                    aggregateOption[aggregateOption.length] = {
                         $match: {
                              "startDate": {
                                   $lte: new Date(req.query.dateTo)
                              }
                         }
                    };
               }

               if (req.query.priceFrom) {
                    aggregateOption[aggregateOption.length] = {
                         $match: {
                              "price": {
                                   $gte: Number(req.query.priceFrom)
                              }
                         }
                    };
               }

               if (req.query.priceTo) {
                    aggregateOption[aggregateOption.length] = {
                         $match: {
                              "price": {
                                   $lte: Number(req.query.dateTo)
                              }
                         }
                    };
               }

               if (req.query.manufacturer) {
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
                                        price: 1
                                   }
                              };
                              break;
                         case "1":
                              aggregateOption[aggregateOption.length] = {
                                   $sort: {
                                        price: -1
                                   }
                              };
                              break;
                         case "2":
                              aggregateOption[aggregateOption.length] = {
                                   $sort: {
                                        startDate: 1
                                   }
                              };
                              break;
                         case "3":
                              aggregateOption[aggregateOption.length] = {
                                   $sort: {
                                        startDate: -1
                                   }
                              };
                              break;
                    }
               }
               return aggregateOption;
          } catch (e) {
               return e;
          }
     }
}