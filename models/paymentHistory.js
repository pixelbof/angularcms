var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    var PaymentHistory = new Schema({
        userName: String,
        userAddress: String,
        productName: String,
        productImage: String,
        productSize: String,
        productPrice: Number,
        orderDate: {
            type: Date,
            default: Date.now
        },
        orderStatus: {
            type: String,
            default: "order recieved"
        },
        lastUpdated: Date
    });

    var PaymentHistory = mongoose.model('PaymentHistory', PaymentHistory);

module.exports = PaymentHistory;