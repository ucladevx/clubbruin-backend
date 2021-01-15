import mongoose, { Document, Schema } from "mongoose";

interface ChatDoc extends Document {
    messages: string;
    name: string;
}

const chatSchema: Schema = new Schema(
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
module.exports = Chat = mongoose.model<ChatDoc>("Chat", chatSchema);