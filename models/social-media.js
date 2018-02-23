var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var socialMedia = new Schema({
        title: String,
        url: String,
        icon: String,
    });
    var socialMedia = mongoose.model('socialMedia', socialMedia);
module.exports=socialMedia;