var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    var Product = new Schema({
        productName: String,
        productImage: String,
        productDescription: String,
        productSize: String,
        productPrice: Number
    });

    var Product = mongoose.model('Product', Product);

module.exports = Product;