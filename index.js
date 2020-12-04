const express = require('express');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const { Server, LobbyRoom, RelayRoom } = require('colyseus');
const { monitor } = require('@colyseus/monitor');
const { MapRoom } = require('./utils/rooms/map-room');
const { GameRoom } = require('./utils/rooms/game-room');
const ColyseusRoutes = require('./routes/colyseus/index');

const port = Number(process.env.PORT || 9000) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();

app.use(express.json());

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
    server: createServer(app),
    express: app,
    pingInterval: 0,
});

gameServer.define("map", MapRoom);
gameServer.define("game", GameRoom);

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
const http = require("http").Server(app)
const socketio = require("socket.io");

// add this to .env
const PORT = process.env.PORT || 9000
const SOCKET_PORT = process.env.SOCKET_PORT || 3333
const io = socketio(http);


const Chat = require("./models/chat");


io.on("connection", (socket) => {
    console.log("user connected")
    Chat.find({}, function(err,messages) {
        if(err) return handleError(err);
        messages.forEach(function(message) {
            console.log("history msg:" + message.messages + " name: " + message.name + message._id);
            socket.emit("received", { text: message.messages, name: message.name, time: message.createdAt} )

        })
    });
    socket.on("chat message", (msg) => {

        chatMsg = new Chat({ messages: msg.text, name: msg.name});
        chatMsg.save();
        console.log();
        console.log(chatMsg.get("messages") + chatMsg.get("name") + chatMsg._id.getTimestamp());   
        socket.broadcast.emit("received", { text: chatMsg.get("messages"), name: chatMsg.get("name"), time: chatMsg._id.getTimestamp() })

    })
    socket.on("disconnect", () => {
        console.log("Disconnected")
    })
})


const authRoutes = require("./routes/auth/auth")

app.use("/auth", authRoutes)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/health', (req, res) => {
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