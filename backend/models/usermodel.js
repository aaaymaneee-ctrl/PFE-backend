const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    prenom: {
        type: String,
        required: true,
    },
    nom: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateCreation: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    blockedAt: {
        type: Date,
        default: null
    },
    blockedReason: {
        type: String,
        default: null
    },
    cv: {
        filename: String,
        originalName: String,
        path: String,
        uploadDate: {
            type: Date,
            default: Date.now
        },
            extractedText: String,
            numPages: Number,
            metadata: {
                title: String,
                author: String,
                creator: String,
                producer: String
            }
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;