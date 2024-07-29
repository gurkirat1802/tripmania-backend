const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        required: true,
    },
    hashtag1: {
        type: String,
        required: true,
    },
    hashtag2: {
        type: String,
        required: true,
    },
    comments: [
        {
            comment: String,
            rating: Number,
            createdAt: { type: Date, default: Date.now }
        }
    ]
},{ versionKey: false });

module.exports = mongoose.model("Trip", tripSchema);