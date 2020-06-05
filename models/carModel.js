const mongoose = require('mongoose');
const crypt = require('bcrypt');

const schemaCarModel = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 30,
     },
     manufacturer: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'Pole marka jest wymagane.'],
          ref: 'carManufacturer'
     }
});

const CarModel = mongoose.model('carModel', schemaCarModel);

module.exports = CarModel;