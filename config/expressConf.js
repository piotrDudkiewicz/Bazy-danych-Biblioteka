const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const routeUser = require('../routes/users');
const routeLog = require('../routes/userLog');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');

const car = require('../models/car');

menuItems: [{
          id: 'login',
          name: 'Logowanie',
          uri: '/user/login'
     },
     {
          id: 'register',
          name: 'Rejestracja',
          uri: '/user/register'
     }
]

module.exports = function () {
     app = express();

     app.set('views', './views');
     app.set('view engine', 'ejs');


     app.use(bodyParser.urlencoded({
          extended: true
     }));

     app.use(bodyParser.json());
     app.use(morgan('combined'));
     app.use(expressLayouts);


     app.use(session({
          secret: 'user',
          resave: false,
          saveUninitialized: false
     }));

     require('./passportConfig')(app);

     app.use('/user', routeUser);

     app.get("/", (req, res) => {
          res.render('index.ejs', {
               page: 'Strona główna',
               menuId: 'home',
               isLoggedIn: req.isAuthenticated()
          });
     });

     app.use('/', routeLog);

     return app;
};