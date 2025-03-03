const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true }, // Add full name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }, // Add phone number
    address: { type: String, required: true } // Add address
});

module.exports = mongoose.model("User", userSchema);
