const express = require('express');
const router = express.Router();
const carPanel = require('./carServicePanel');
const hirePanel = require('./hirePanel');

router.use(function (req, res, next) {
     if (req.body.type == "service") {
          return next();
     }
     res.redirect("/panel");
});

router.use('/car', carPanel);

router.use('/hire', hirePanel);

module.exports = router;
