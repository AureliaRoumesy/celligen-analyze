const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
  name: String,
  email: String,
  password: String
});


const userModel = mongoose.model('user', User);

module.exports = userModel;