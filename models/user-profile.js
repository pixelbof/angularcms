var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userProfile = new Schema({
        chatName: String,
        fullName: String,
        dob: Date,
        profileImage: String,
        shortBio: String,
        dateAdded: Date,
        lastUpdated: Date
    });
    var userProfile = mongoose.model('userProfile', userProfile);
module.exports=userProfile;