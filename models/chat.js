const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema(
    {

        messages: {
            type: String
        },
        name: {
            type: String
        },

    },
    { timestamps: true }
);

let Chat;
module.exports = Chat = mongoose.model("Chat", chatSchema);