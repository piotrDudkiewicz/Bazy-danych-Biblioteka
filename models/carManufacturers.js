const mongoose = require('mongoose');
const crypt = require('bcrypt');

const schemaCarManufacturer = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 30,
          unique: [true, 'Pole nazwa jest wymagane.']
     }
});

const CarManufacturer = mongoose.model('carManufacturer', schemaCarManufacturer);

module.exports = CarManufacturer;