"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var cors = require('cors');
var createServer = require('http').createServer;
var _a = require('colyseus'), Server = _a.Server, LobbyRoom = _a.LobbyRoom, RelayRoom = _a.RelayRoom;
var monitor = require('@colyseus/monitor').monitor;
var MapRoom = require('../utils/rooms/map-room').MapRoom;
var GameRoom = require('../utils/rooms/game-room').GameRoom;
var ColyseusRoutes = require('../routes/colyseus/index');
// const { Request, Response } = require('express');
var port = Number(process.env.PORT || 9000) + Number(process.env.NODE_APP_INSTANCE || 0);
var app = express();
app.use(cors());
app.use(express.json());
// Attach WebSocket Server on HTTP Server.
// const gameServer = new Server({
//     server: createServer(app),
//     express: app,
//     pingInterval: 0,
// });
// gameServer.define("map", MapRoom);
// gameServer.define("game", GameRoom);
// (optional) attach web monitoring panel
app.use('/colyseus', monitor());
app.use('/', ColyseusRoutes);
// gameServer.onShutdown(function () {
//     console.log(`game server is going down.`);
// });
// gameServer.listen(port);
console.log("Listening on http://localhost:" + port);
var mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var chatApp = express();
chatApp.use(cors());
var http = require("http").Server(chatApp);
var socketio = require("socket.io");
// add this to .env
var PORT = process.env.PORT || 9000;
var SOCKET_PORT = process.env.SOCKET_PORT || 3333;
var io = socketio(http);
var Chat = require("../models/chat");
// io.on("connection", (socket) => {
//     console.log("user connected",socket.handshake.headers.referer, socket.id)
//     Chat.find({}, function(err,messages) {
//         if(err) return handleError(err);
//         messages.forEach(function(message) {
//             // console.log("history msg:" + message.messages + " name: " + message.name + message._id);
//             socket.emit("received", { text: message.messages, name: message.name, time: message.createdAt} )
//         })
//     });
//     socket.on("chat message",async (msg) => {
//         // console.log('new msg' + msg);
//         const chatMsg = new Chat({ messages: msg.text, name: msg.name});
//         await chatMsg.save();
//         // console.log(chatMsg.get("messages") + chatMsg.get("name") + chatMsg._id.getTimestamp());   
//         socket.broadcast.emit("received", { text: chatMsg.get("messages"), name: chatMsg.get("name"), time: chatMsg._id.getTimestamp() })
//     })
//     socket.on("disconnect", () => {
//         console.log("Disconnected")
//     })
// })
var authRoutes = require("../routes/auth/auth");
app.use("/auth", authRoutes);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/health', function (req, res) {
    res.status(200).send({
        message: "test 1 -> Listening on Port " + PORT
    });
});
// const connectToDB = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://superuser:clubbruin@cluster0.pcs6c.mongodb.net/db?retryWrites=true&w=majority', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true
//         })
//         console.log('Connected to database')
//     } catch (err) {
//         console.log('Could not connect to database. Exiting...')
//         process.exit(1)
//     }
// }
app.listen(PORT, function () {
    console.log("Listening on Port " + PORT);
});
// http.listen(SOCKET_PORT, () => {
//     console.log("connected to port: " + SOCKET_PORT)
// })
// connectToDB()
