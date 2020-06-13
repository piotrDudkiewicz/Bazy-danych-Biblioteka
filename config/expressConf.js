const express = require('express');
const routeUser = require('../routes/users');
const routeLog = require('../routes/userLog');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');

const car = require('../models/car');

module.exports = function () {
     app = express();

     app.set('views', './views')
     app.set('view engine', 'ejs');

     app.use(bodyParser.urlencoded({
          extended: true
     }));

     app.use(bodyParser.json());
     app.use(morgan('combined'));


     app.use(session({
          secret: 'user',
          resave: false,
          saveUninitialized: false
     }));

     require('./passportConfig')(app);

     app.use('/user', routeUser);

     app.get("/", (req, res) => {
          res.render('index.ejs');
     });

     app.use('/', routeLog);

     return app;
};