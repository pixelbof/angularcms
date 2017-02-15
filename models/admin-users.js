var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminUser = new Schema({
        username: String,
        password: String,
        userType: String,
        dateAdded: Date,
        lastLogin: Date,
        accountStatus: String,
    });
    var adminUser = mongoose.model('adminUser', adminUser);
module.exports=adminUser;