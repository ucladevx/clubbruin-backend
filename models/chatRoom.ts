import mongoose, { Document, Schema } from "mongoose";

interface ChatRoomDoc extends Document {
    chatId: string;
    type: string;
    chatName: string;
}

const ChatRoomSchema: Schema = new Schema(
    {

        chatId: {
            type: String
        },
        type: {
            type: String
        },
        ChatName: {
            type: String
        },
    }
);

let ChatRoom = mongoose.model<ChatRoomDoc>("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;


