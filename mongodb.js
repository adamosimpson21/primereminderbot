const mongoose = require('mongoose');
mongoose.set('debug', process.env.NODE_ENV==='development');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/primeRemind')

mongoose.Promise = Promise;

const subSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true
  },
  lastSubbed: {
    type:Number,
    required:true
  },
  channel: {
    type:String,
    required:true
  },
  blacklist: {
    type:Boolean,
    required:true,
    default: false
  }
})

const dataBaseSchema = new mongoose.Schema({
  infoMessage: {
    type: Number,
    default:0
  }
})

const errorSchema = new mongoose.Schema({
  errorMessage:{
    type:String,
    required:true
  }
},{
  timestamps:true
})

const Sub = mongoose.model("Sub", subSchema);
const Error = mongoose.model("Error", errorSchema);
const DataBase = mongoose.model("DataBase", dataBaseSchema);

module.exports = {Sub, Error, DataBase};