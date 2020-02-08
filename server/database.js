const mongoose = require('mongoose');
const constants = require('./constants');

//Removes the warning with promises
mongoose.Promise = global.Promise;

try {
  mongoose.connect(constants.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (err) {
  mongoose.createConnection(constants.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}
mongoose.connection
  .once('open', () => console.log('MongoDB Running'))
  .on('error', e => {
    throw e;
  });
