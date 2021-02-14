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

router.get("/getUserChats", async (req: Request, res: Response) => {
    const {username} = req.body
    try{
        let user = await userModel.findOne({username: username})
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        let chatIds : Array<Number> = user.chatRooms
        let chats: Array<any> = []
        chatIds.forEach(async (id: Number) => {
            let chat = chatRoomModel.findOne({chatId: id})
            if(chat){
                chats.push({chatId: id, type: chat.type, chatName: chat.chatName})
            }
        })
        return res.status(200).json(chats)
    }
    catch(err){
        return res.status(401).json({message: err.message})
    }
})

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

router.get('/searchUser', jwtCheck, async (req: Request, res: Response) => {

    let { pattern } = req.query

    pattern = String(pattern)
    let listOfNames: string[] = []
    try {

        // figure out what type this is
        const users = await userModel.find({ username: new RegExp(pattern) })

        users.forEach((user: any) => {
            listOfNames.push(user.username)
        })

    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    return res.status(200).json({
        listOfNames
    })
})

module.exports = router;