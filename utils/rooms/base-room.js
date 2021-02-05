"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.BasePlayer = exports.BaseRoom = void 0;
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
const index_1 = require("../chat/index");
const userModel = require('../../models/user');
const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater';
class BasePlayer extends schema_1.Schema {
    constructor(username) {
        super();
        this.username = username;
        this.major = '';
        this.year = 0;
        this.importDBValues(username);
    }
    //pull all required values from database
    importDBValues(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel.findOne({ username: username });
            if (!user) {
                console.log("user does not exist!");
                return;
            }
            this.major = user.major;
            this.year = user.year;
        });
    }
}
__decorate([
    schema_1.type("string")
], BasePlayer.prototype, "username", void 0);
__decorate([
    schema_1.type("string")
], BasePlayer.prototype, "major", void 0);
__decorate([
    schema_1.type("number")
], BasePlayer.prototype, "year", void 0);
exports.BasePlayer = BasePlayer;
class BaseRoom extends colyseus_1.Room {
    constructor() {
        super();
        this.userList = [];
        this.messageHist = [];
    }
    onCreate(options) {
        console.log("Base generated");
        this.onMessage("chat-send", (client, data) => {
            console.log("Client (", client.sessionId, ") sent message: ", data);
            var message = new index_1.Message(options.username, data, Date.now());
            this.messageHist.push(message);
            this.broadcast("chat-recv", message, { except: client });
        });
        this.onMessage("chat-recv", (client, data) => {
            console.log("Client (", client.sessionId, ") recieved message: ", data.message);
        });
    }
    //Authorize with JWT
    // onAuth(client: Client, options: any) {
    //     console.log('authorizing...');
    //     var token: string = options.accessToken;
    //     var user: string = options.username;
    //     if (this.userList.includes(user)) {
    //         console.log('user already in room!');
    //         return false;
    //     }
    //     this.userList.push(user);
    //     return jwt.verify(token, signingSecret, (err) => {
    //         if (err) {
    //             console.log('unauthorized join!');
    //             return false;
    //         }
    //         console.log('token authorized!');
    //         return true;
    //     });
    // }
    onJoin(client, options) {
        console.log(options.username + ' joined room!');
    }
    onLeave(client) {
        console.log('left room!');
    }
    onDispose() {
        console.log("Room Disposed");
    }
}
exports.BaseRoom = BaseRoom;
