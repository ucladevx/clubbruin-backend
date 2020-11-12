const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    major: {
        type: String,
    },
    year: {
        type: Number
    }
})

const User = mongoose.model("User", UserSchema);
module.exports = User;