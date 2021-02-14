import { Request, Response } from "express";
import { ChatRoom } from "../../utils/rooms/chat-room";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user')
const chatRoomModel = require('../../models/chatRoom')
const mongoose = require('mongoose')

const { jwtCheck } = require('../../middleware/auth')

router.post("/new", jwtCheck, async (req: Request, res: Response) => {

    const { participants, chatName } = req.body;

    if (participants == null || participants == undefined) {
        return res.status(400).json({
            message: "Need at least one participant."
        })
    }

    let chatType = "private"
    if (chatName != null && chatName != undefined) {
        chatType = "group"
    }

    console.log(chatType)

    // create and insert chatRoomId into each participant's chatRooms[]

    const chatRoomId = Math.ceil(Math.random() * 1000000000000);
    console.log("Chat Room ID: ", chatRoomId);

    try {

        await userModel.updateMany({
            username: {
                $in: participants
            }
        }, {
            $push: {
                chatRooms: chatRoomId
            }
        })

        // push metadata into chat room collection. chat id, chat type, chat name

        const chatRoomMetadata = new chatRoomModel({
            chatId: chatRoomId,
            type: chatType,
            ChatName: chatName
        })

        await chatRoomMetadata.save()

        return res.status(200).json({
            message: "Chat Room created successfully, and metadata saved.",
            chatId: chatRoomId,
            chatType,
            chatName
        })

    } catch (err) {
        // console.log(err);
        return res.status(400).json({
            message: err.message
        })
    }

})

module.exports = router;