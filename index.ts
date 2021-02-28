import { Request, Response } from "express";
import { Socket } from "socket.io";

const express = require('express');
const path = require('path');
const cors = require('cors');
import { createServer } from 'http';
import { Server, LobbyRoom, RelayRoom } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import { BaseRoom } from './utils/rooms/base-room';
import { MapRoom } from './utils/rooms/map-room';
import { GameRoom } from './utils/rooms/game-room';
import { ChatRoom } from './utils/rooms/chat-room';
import { JitsiRoom } from './utils/rooms/jitsi-room';

import { router as ColyseusRoutes } from './routes/colyseus/index';


const port = Number(process.env.PORT || 9000) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();
app.use(cors())
app.use(express.json());

interface Message {
    messages: string,
    name: string,
    createdAt: Date
}

const handleError = (err: Error) => {
    console.log(err)
}

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
    server: createServer(app),
    express: app,
    pingInterval: 0,
});

gameServer.define("map", MapRoom);
gameServer.define("game", GameRoom);
gameServer.define("base", BaseRoom);
gameServer.define("chat", ChatRoom)
gameServer.define("jitsi", JitsiRoom)


// (optional) attach web monitoring panel
app.use('/colyseus', monitor());
app.use('/', ColyseusRoutes);

gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});

gameServer.listen(port);

console.log(`Listening on http://localhost:${port}`);
const mongoose = require('mongoose')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const chatApp = express()
chatApp.use(cors())
const http = require("http").Server(chatApp)
const socketio = require("socket.io");

// add this to .env
const PORT = process.env.PORT || 9000
const SOCKET_PORT = process.env.SOCKET_PORT || 3333
const io = socketio(http);


const Chat = require("./models/chat");


io.on("connection", (socket: Socket) => {
    console.log("user connected", socket.handshake.headers.referer, socket.id)
    Chat.find({}, function (err: Error, messages: Array<Message>) {
        if (err) return handleError(err);
        messages.forEach(function (message) {
            // console.log("history msg:" + message.messages + " name: " + message.name + message._id);
            socket.emit("received", { text: message.messages, name: message.name, time: message.createdAt })

        })
    });
    socket.on("chat message", async (msg) => {
        // console.log('new msg' + msg);

        const chatMsg = new Chat({ messages: msg.text, name: msg.name });
        await chatMsg.save();
        // console.log(chatMsg.get("messages") + chatMsg.get("name") + chatMsg._id.getTimestamp());   
        socket.broadcast.emit("received", { text: chatMsg.get("messages"), name: chatMsg.get("name"), time: chatMsg._id.getTimestamp() })

    })
    socket.on("disconnect", () => {
        console.log("Disconnected", socket.id)
    })
})

const authRoutes = require("./routes/auth/auth")
const chatRoutes = require("./routes/chat/chat")

app.use("/auth", authRoutes)
app.use("/chat", chatRoutes)

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send({
        message: `test 1 -> Listening on Port ${PORT}`
    })
})


const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://superuser:clubbruin@cluster0.pcs6c.mongodb.net/db?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to database')
    } catch (err) {
        console.log('Could not connect to database. Exiting...')
        process.exit(1)
    }
}

// app.listen(PORT, () => {
//     console.log(`Listening on Port ${PORT}`)
// })

http.listen(SOCKET_PORT, () => {
    console.log("connected to port: " + SOCKET_PORT)
})

connectToDB()