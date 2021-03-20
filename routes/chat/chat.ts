import { Request, Response } from "express";
import { StringDecoder } from "string_decoder";
import { ChatRoom } from "../../utils/rooms/chat-room";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user')
const chatRoomModel = require('../../models/chatRoom')
const mongoose = require('mongoose')
const MongoPaging = require("mongo-cursor-pagination")

const { jwtCheck } = require('../../middleware/auth')

router.post("/getUserChats", async (req: Request, res: Response) => {
    const { username } = req.body
    try {
        let user = await userModel.findOne({ username: username })
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }
        let chatIds: Array<string> = user.chatRooms
        let chats: Array<any> = []
        let promises: Array<Promise<any>> = []
        chatIds.forEach(async (id: string) => {
            console.log(id)
            const promise = new Promise(async (resolve, reject) => {
                const chat = (await chatRoomModel.findOne({ _id: new mongoose.Types.ObjectId(id) }))
                if (chat) {
                    resolve(chatRoomModel.findOne({ _id: new mongoose.Types.ObjectId(id) }))
                } else {
                    reject('User Not found')
                }
            })
            promises.push(promise)
        })
        return res.status(200).json(await Promise.all(promises))
    }
    catch (err) {
        return res.status(401).json({ message: err.message })
    }
})

router.post("/new", async (req: Request, res: Response) => {

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

    // const chatRoomId = Math.ceil(Math.random() * 1000000000000);
    // console.log("Chat Room ID: ", chatRoomId);

    try {

        // push metadata into chat room collection. chat id, chat type, chat name

        const chatRoomMetadata = new chatRoomModel({
            // chatId: chatRoomId,
            type: chatType,
            chatName: chatName
        })

        const { _id } = await chatRoomMetadata.save()

        await userModel.updateMany({
            username: {
                $in: participants
            }
        }, {
            $push: {
                chatRooms: _id
            }
        })

        return res.status(200).json({
            message: "Chat Room created successfully, and metadata saved.",
            // chatId: chatRoomId,
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

    let { pattern, limit, nextPage, previousPage } = req.query

    pattern = String(pattern)
    limit = String(limit)
    let listOfNames: string[] = []
    try {

        const users = await MongoPaging.find(userModel.collection, {
            query: {
                username: new RegExp(pattern)
            },
            limit: parseInt(limit), //number of pages we want
            sortAscending: false,
            next: nextPage, //the next string that is produced after running getPostsPage once
            previous: previousPage
        })

        for (let i = 0; i < users.results.length; i++) {
            listOfNames.push(users.results[i].username)
        }

        return res.status(200).json({
            listOfNames,
            previous: users.previous,
            hasPrevious: users.hasPrevious,
            next: users.next,
            hasNext: users.hasNext
        })

    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

})

module.exports = router;
