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
const express = require('express');
const path = require('path');
const cors = require('cors');
const http_1 = require("http");
const colyseus_1 = require("colyseus");
const monitor_1 = require("@colyseus/monitor");
const base_room_1 = require("./utils/rooms/base-room");
const map_room_1 = require("./utils/rooms/map-room");
const game_room_1 = require("./utils/rooms/game-room");
const chat_room_1 = require("./utils/rooms/chat-room");
const jitsi_room_1 = require("./utils/rooms/jitsi-room");
const index_1 = require("./routes/colyseus/index");
const port = Number(process.env.PORT || 9000) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();
app.use(cors());
app.use(express.json());
const handleError = (err) => {
    console.log(err);
};
// Attach WebSocket Server on HTTP Server.
const gameServer = new colyseus_1.Server({
    server: http_1.createServer(app),
    express: app,
    pingInterval: 0,
});
gameServer.define("map", map_room_1.MapRoom);
gameServer.define("game", game_room_1.GameRoom);
gameServer.define("base", base_room_1.BaseRoom);
gameServer.define("chat", chat_room_1.ChatRoom);
gameServer.define("jitsi", jitsi_room_1.JitsiRoom);
// (optional) attach web monitoring panel
app.use('/colyseus', monitor_1.monitor());
app.use('/', index_1.router);
gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});
gameServer.listen(port);
console.log(`Listening on http://localhost:${port}`);
const mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const chatApp = express();
chatApp.use(cors());
const http = require("http").Server(chatApp);
const socketio = require("socket.io");
// add this to .env
const PORT = process.env.PORT || 9000;
const SOCKET_PORT = process.env.SOCKET_PORT || 3333;
const io = socketio(http);
const Chat = require("./models/chat");
io.on("connection", (socket) => {
    console.log("user connected", socket.handshake.headers.referer, socket.id);
    Chat.find({}, function (err, messages) {
        if (err)
            return handleError(err);
        messages.forEach(function (message) {
            // console.log("history msg:" + message.messages + " name: " + message.name + message._id);
            socket.emit("received", { text: message.messages, name: message.name, time: message.createdAt });
        });
    });
    socket.on("chat message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('new msg' + msg);
        const chatMsg = new Chat({ messages: msg.text, name: msg.name });
        yield chatMsg.save();
        // console.log(chatMsg.get("messages") + chatMsg.get("name") + chatMsg._id.getTimestamp());   
        socket.broadcast.emit("received", { text: chatMsg.get("messages"), name: chatMsg.get("name"), time: chatMsg._id.getTimestamp() });
    }));
    socket.on("disconnect", () => {
        console.log("Disconnected", socket.id);
    });
});
const authRoutes = require("./routes/auth/auth");
const chatRoutes = require("./routes/chat/chat");
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/health', (req, res) => {
    res.status(200).send({
        message: `test 1 -> Listening on Port ${PORT}`
    });
});
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect('mongodb+srv://superuser:clubbruin@cluster0.pcs6c.mongodb.net/db?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to database');
    }
    catch (err) {
        console.log('Could not connect to database. Exiting...');
        process.exit(1);
    }
});
// app.listen(PORT, () => {
//     console.log(`Listening on Port ${PORT}`)
// })
http.listen(SOCKET_PORT, () => {
    console.log("connected to port: " + SOCKET_PORT);
});
connectToDB();
