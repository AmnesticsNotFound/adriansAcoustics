const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    name: { type:String, required:true, maxLength: 30, },
    email: {type:String, required:true, maxLength:30},
    text:{type:String, required:true, maxLength:1000},
    picture: {type:String, required:true,},
    entryID:{type:String, required:true,},
    timestamp: { type:Date, required: true, default: Date.now}
});

const headphoneComment = mongoose.model("headphoneComment", CommentSchema);
const albumComment = mongoose.model("albumComment", CommentSchema);
module.exports = {
    
    headphoneComment, albumComment
}
