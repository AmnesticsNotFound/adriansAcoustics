const mongoose = require("mongoose");

const HeadphoneSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    description: String,
    brand: String,
    price: String,
    imgs: Array,
    vid: String,   
});


module.exports = mongoose.model("Headphone", HeadphoneSchema);