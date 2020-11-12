const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();
app.use(express.json());
app.use(cors());
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
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);

        chatMsg = new Chat({ messages: msg.text, name: msg.name });
        chatMsg.save();

        socket.broadcast.emit("received", { text: msg.text, name: chatMsg.get("name"), time: chatMsg.get("timestamp") })

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
        message: `Listening on Port ${PORT}`
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

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})

http.listen(SOCKET_PORT, () => {
    console.log("connected to port: " + SOCKET_PORT)
})

connectToDB()
