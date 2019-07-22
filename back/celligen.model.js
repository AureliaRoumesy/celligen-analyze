const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Celligen = new Schema({
  finish:  Boolean,
  name: String,
  data: Array,
  finish: Boolean,
  dateStart: Date,
});


const celligenModel = mongoose.model('celligen', Celligen);

module.exports = celligenModel;