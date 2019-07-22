const mongoose = require('mongoose');
require('dotenv').config()

const dbRoute = process.env.MONGO_HOST;

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

module.exports = db;