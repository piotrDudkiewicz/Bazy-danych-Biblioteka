const mongoose = require('mongoose');
const user = require('./users');
const car = require('./car');

const schemaCarHire = new mongoose.Schema({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'users'
     },
     car: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'car'
     },
     startDate: {
          type: Date,
          default: new Date()
     },
     endDate: {
          type: Date
     },
     plannedDate: {
          type: Date,
          required: true
     },
     status: {
          type: String,
          enum: ['aktywne', 'zakonczone'],
          default: 'aktywne'
     }
});

const CarHire = mongoose.model('CarHire', schemaCarHire);

module.exports = CarHire;