var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    nickname: String,
    socketid: String
});

var messageSchema = mongoose.Schema({
    sender: String,
    message: String,
    created: {type: Date, default: Date.now()}
});

var user = mongoose.model('user',userSchema);
var message = mongoose.model('message', messageSchema);

module.exports = {
    user : user,
    message: message
}