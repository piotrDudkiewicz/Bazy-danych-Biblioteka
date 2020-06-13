const mongoose = require('mongoose');
const crypt = require('bcrypt');

const schemaCar = new mongoose.Schema({
     plate: {
          type: String,
          required: true,
          unique: true,
          validate: {
               validator: function (value) {
                    const reg = new RegExp("^[A-Z][A-Z0-9]{3,7}$");
                    return reg.test(value);
               },
               message: "Popraw numer rejestracyjny!"
          }
     },
     car: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'carModel',
          required: [true, 'Popraw to pole']
     },
     enginePower: {
          type: Number,
          min: 10,
          max: 3000,
          required: [true, 'Pole moc jest wymagane']
     },
     engineSize: {
          type: Number,
          min: 0.5,
          max: 10,
          required: [true, 'Pole pojemność jest wymagane']
     },
     color: {
          type: String,
          minlength: 3,
          maxlength: 20
     },
     productionYear: {
          type: Number,
          required: true,
          min: 1900
     },
     pricePerDay: {
          type: Number,
          min: 20,
          required: true
     }

});

schemaCar.path('plate').set(function (value) {
     return value.toUpperCase();

});

const Car = mongoose.model('Car', schemaCar);

module.exports = Car;