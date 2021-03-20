import mongoose, { Document, Schema } from "mongoose";

interface ChatDoc extends Document {
    messages: string;
    name: string;
}

const chatSchema: Schema = new Schema(
    {

        message: {
            type: String
        },
        username: {
            type: String
        },
        chatRoom: {
            type: String
        },
        timestamp: {
            type: Date
        }
    }
);

let Chat;
module.exports = Chat = mongoose.model<ChatDoc>("Chat", chatSchema);