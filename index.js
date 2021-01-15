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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var cors = require('cors');
var createServer = require('http').createServer;
var _a = require('colyseus'), Server = _a.Server, LobbyRoom = _a.LobbyRoom, RelayRoom = _a.RelayRoom;
var monitor = require('@colyseus/monitor').monitor;
var BaseRoom = require('./utils/rooms/base-room').BaseRoom;
var MapRoom = require('./utils/rooms/map-room').MapRoom;
var GameRoom = require('./utils/rooms/game-room').GameRoom;
var ColyseusRoutes = require('./routes/colyseus/index');
var port = Number(process.env.PORT || 9000) + Number(process.env.NODE_APP_INSTANCE || 0);
var app = express();
app.use(cors());
app.use(express.json());
var handleError = function (err) {
    console.log(err);
};
// Attach WebSocket Server on HTTP Server.
var gameServer = new Server({
    server: createServer(app),
    express: app,
    pingInterval: 0,
});
gameServer.define("map", MapRoom);
gameServer.define("game", GameRoom);
gameServer.define("base", BaseRoom);
// (optional) attach web monitoring panel
app.use('/colyseus', monitor());
app.use('/', ColyseusRoutes);
gameServer.onShutdown(function () {
    console.log("game server is going down.");
});
gameServer.listen(port);
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
var Chat = require("./models/chat");
io.on("connection", function (socket) {
    console.log("user connected", socket.handshake.headers.referer, socket.id);
    Chat.find({}, function (err, messages) {
        if (err)
            return handleError(err);
        messages.forEach(function (message) {
            // console.log("history msg:" + message.messages + " name: " + message.name + message._id);
            socket.emit("received", { text: message.messages, name: message.name, time: message.createdAt });
        });
    });
    socket.on("chat message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
        var chatMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatMsg = new Chat({ messages: msg.text, name: msg.name });
                    return [4 /*yield*/, chatMsg.save()];
                case 1:
                    _a.sent();
                    // console.log(chatMsg.get("messages") + chatMsg.get("name") + chatMsg._id.getTimestamp());   
                    socket.broadcast.emit("received", { text: chatMsg.get("messages"), name: chatMsg.get("name"), time: chatMsg._id.getTimestamp() });
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("disconnect", function () {
        console.log("Disconnected", socket.id);
    });
});
var authRoutes = require("./routes/auth/auth");
app.use("/auth", authRoutes);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/health', function (req, res) {
    res.status(200).send({
        message: "test 1 -> Listening on Port " + PORT
    });
});
var connectToDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, mongoose.connect('mongodb+srv://superuser:clubbruin@cluster0.pcs6c.mongodb.net/db?retryWrites=true&w=majority', {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true
                    })];
            case 1:
                _a.sent();
                console.log('Connected to database');
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log('Could not connect to database. Exiting...');
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// app.listen(PORT, () => {
//     console.log(`Listening on Port ${PORT}`)
// })
http.listen(SOCKET_PORT, function () {
    console.log("connected to port: " + SOCKET_PORT);
});
connectToDB();
