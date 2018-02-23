var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    var productSizePrice = new Schema({
        productPrice: Number,
        productSize: String
    });

    var Product = new Schema({
        productName: String,
        productImage: String,
        productDescription: String,
        productOpts: [productSizePrice]
    });

    var Product = mongoose.model('Product', Product);

module.exports = Product;