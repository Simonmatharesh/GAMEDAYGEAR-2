const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true }
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered'] }
});

module.exports = mongoose.model("Order", orderSchema);