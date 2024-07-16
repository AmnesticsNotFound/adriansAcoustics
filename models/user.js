const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    age: Number,
});

module.exports = mongoose.model("User", UserSchema);