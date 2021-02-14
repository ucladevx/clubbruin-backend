"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user');
const chatRoomModel = require('../../models/chatRoom');
const mongoose = require('mongoose');
const { jwtCheck } = require('../../middleware/auth');
router.post("/new", jwtCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { participants, chatName } = req.body;
    if (participants == null || participants == undefined) {
        return res.status(400).json({
            message: "Need at least one participant."
        });
    }
    let chatType = "private";
    if (chatName != null && chatName != undefined) {
        chatType = "group";
    }
    console.log(chatType);
    // create and insert chatRoomId into each participant's chatRooms[]
    const chatRoomId = Math.ceil(Math.random() * 1000000000000);
    console.log("Chat Room ID: ", chatRoomId);
    try {
        yield userModel.updateMany({
            username: {
                $in: participants
            }
        }, {
            $push: {
                chatRooms: chatRoomId
            }
        });
        // push metadata into chat room collection. chat id, chat type, chat name
        const chatRoomMetadata = new chatRoomModel({
            chatId: chatRoomId,
            type: chatType,
            ChatName: chatName
        });
        yield chatRoomMetadata.save();
        return res.status(200).json({
            message: "Chat Room created successfully, and metadata saved.",
            chatId: chatRoomId,
            chatType,
            chatName
        });
    }
    catch (err) {
        // console.log(err);
        return res.status(400).json({
            message: err.message
        });
    }
}));
module.exports = router;
