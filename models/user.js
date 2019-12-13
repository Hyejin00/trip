var mongoose = require('mongoose'), Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var schema = new Schema({
    name: {type: String, required:true, trim:true},
    email: {type: String, required: true, index:true, unique:true, trim:true},
    password: {type:String},
    createdAt: {type:Date, default:Date.now},
    facebook:{id:String,token:String, photo:String},
    role: {type: String, default: "user"} //'user','guide','manager'
});

schema.methods.generateHash = function(password) {
  return bcrypt.hash(password, 10); // return Promise
};
  
schema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password); // return Promise
};

var User = mongoose.model('User', schema);

module.exports = User;
