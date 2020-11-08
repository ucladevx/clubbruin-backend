//this will export A express.router


const express = require('express');
const mongoose = require('mongoose');
const app = express()
const http = require("http").Server(app)
const socketio = require("socket.io");

const port = 3333;

const io = socketio(http);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

const url = "mongodb+srv://superuser:clubbruin@cluster0.djc4y.mongodb.net/messages?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser: true} );

const db = mongoose.connection;
const Chat = require("../models/ChatSchema");

db.once('open', _ => {
    console.log('Database connected:', url)
})
db.on('error', err => {
    console.error('connection error:', err)
})

io.on("connection", (socket)=>{
    console.log("user connected")
    socket.on("chat message", (msg)=> {
    console.log("message: " + msg);
    
    chatMsg = new Chat({messages: msg, name: "Rohan"});
    chatMsg.save();

    socket.broadcast.emit("received", {message : msg, senderId: chatMsg.get("name"), time: chatMsg.get("timestamp") } )

})
socket.on("disconnect", ()=>{
    console.log("Disconnected")
})
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/history', async (req, res) => {
    const chatList = await Chat.find()

    return res.json({chats: chatList});
});

http.listen(port, ()=>{
    console.log("connected to port: " + port )
})