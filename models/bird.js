const mongoose = require("mongoose");

const BirdSchema = new mongoose.Schema({
    _id: String,
    description: String,
    diet: String,
    difficulty: String,
    length: String,
    lifespan: String,
    name: String,
    origin: String,
    pet: String,
    price: String,
    scientificName: String,
    weight: String,
    rarity: String,
    id:Array,
    vid: String,

    
});


module.exports = mongoose.model("Bird", BirdSchema);
