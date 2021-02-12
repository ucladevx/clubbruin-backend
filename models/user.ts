import mongoose, { Schema, Document } from 'mongoose';

interface UserDoc extends Document {
    username: string;
    email: string;
    password: string;
    major: string;
    year: number;
}

const UserSchema: Schema = new Schema({
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
    },
    chatRooms: {
        type: [String]
    }
})

const User = mongoose.model<UserDoc>("User", UserSchema);
module.exports = User;