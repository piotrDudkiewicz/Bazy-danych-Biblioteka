const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schemaUser = new mongoose.Schema({
     login: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 30,
          unique: true
     },
     email: {
          type: String,
          required: true,
          validate: {
               validator: function (value) {
                    const reg = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$");
                    return reg.test(value);
               },
               message: 'Incorrect e-mail format. Format must be like example@mail.com'
          }
     },
     name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 30
     },
     surname: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50
     },
     password: {
          type: String,
          validate: {
               validator: function (value) {
                    const reg = new RegExp(".{8,32}");
                    return reg.test(value);
               },
               message: 'Password must be 8-32 characters long'
          },
          required: true
     },
     type: {
          type: String,
          enum: ['service', 'client'],
          required: true
     },
});

schemaUser.pre('save', function (next) {
     var user = this;

     bcrypt.hash(user.password, 10, function (err, hash) {
          if (err) return next(err);
          user.password = hash;
          return next();
     });
});


const Users = mongoose.model('users', schemaUser);

module.exports = Users;
