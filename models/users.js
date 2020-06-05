const mongoose = require('mongoose');

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
               message: 'email is bad'
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
                    const reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*.])(?=.{8,})");
                    return reg.test(value);
               },
               message: 'Password is bad'
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

     crypt.hash(user.password, 10, function (err, hash) {
          if (err) return next(err);
          user.password = hash;
          return next();
     });
});


const Users = mongoose.model('users', schemaUser);

module.exports = Users;