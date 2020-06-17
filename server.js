const app = require('./config/expressConf')();
const mongoose = require('mongoose');
const dbConfig = require('./config/config');

mongoose.connect(dbConfig.uri, dbConfig.opts).then((info) => console.log("GOOD!!!")).catch(err => console.log("Error wit DB:" + err));
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 300;

app.listen(port, () => {
     console.log('Running');
});