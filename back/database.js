const mongoose = require('mongoose');
require('dotenv').config();

const authData =  {
  'user': process.env.MONGODB_USER,
  'pass': process.env.MONGODB_PASS,
  'useNewUrlParser': true,
  'useCreateIndex': true
}; 

mongoose.connect(
  process.env.MONGODB_URI,
  authData,
);

let db = mongoose.connection;

module.exports = db;
