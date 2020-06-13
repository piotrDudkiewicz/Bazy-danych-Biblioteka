const mongoose = require('mongoose');

const schemaCarHire = new mongoose.Schema({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'users'
     },
     car: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Car'
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
     },
     price: {
          type: Number
     },
     plannedDays: {
          type: Number,
          min: 1,
          default: 1
     }
});

schemaCarHire.path('price').set(function (num) {
     return parseFloat(num).toFixed(2);
});

schemaCarHire.pre("updateOne", async function (next) {
     try {
          const data = this.getUpdate()
          if (data.status == "zakonczone") {
               const price = await CarHire.findOne({
                    _id: this._conditions._id
               }).populate('car', 'pricePerDay');

               data.endDate = new Date();

               const temp = new Date(price.startDate);
               const inTime = data.endDate.getTime() - temp.getTime();
               const inDays = Math.round(inTime / (1000 * 3600 * 24));

               data.price = price.car.pricePerDay * inDays;

               this.update({}, data).exec()
          }
          next();
     } catch (e) {
          next(e);
     }
});

const CarHire = mongoose.model('CarHire', schemaCarHire);

module.exports = CarHire;