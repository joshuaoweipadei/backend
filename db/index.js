const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {});
    console.log("Connection is successful");
  } catch (error) {
    console.log('Database could not connected: ' + error.message)
    process.exit(1);
  }
}

module.exports = dbConnect;