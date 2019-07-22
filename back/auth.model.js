const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Auth = new Schema({
  name: String,
  email: String,
  password: String
});


const authModel = mongoose.model('auth', Auth);

module.exports = authModel;