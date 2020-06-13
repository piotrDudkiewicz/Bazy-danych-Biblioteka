const app = require('./config/expressConf')();
const mongoose = require('mongoose');
const dbConfig = require('./config/config');

mongoose.connect(dbConfig.uri, dbConfig.opts).then((info) => console.log("GOOD!!!")).catch(err => console.log("Error wit DB:" + err));

app.listen(3000, () => {
     console.log('Running');
});