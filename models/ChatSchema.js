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
    { timestamps:true }
);

var Chat;
module.exports = Chat = mongoose.model("Chat", chatSchema);
