var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: String,
    email: String,
    password : String,
    name : String
});

module.exports = mongoose.model('Users', UserSchema);