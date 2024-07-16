const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    artist: String,
    genre: String,
    release: String,
    trackListing: Array,
})

module.exports = mongoose.model("Album", AlbumSchema);