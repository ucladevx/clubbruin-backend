"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePlayer = exports.BaseRoom = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater';
class BasePlayer extends schema_1.Schema {
    constructor(username) {
        super();
        this.username = "";
        this.username = username;
    }
}
__decorate([
    schema_1.type("string")
], BasePlayer.prototype, "username", void 0);
exports.BasePlayer = BasePlayer;
class BaseRoom extends colyseus_1.Room {
    constructor() {
        super();
        this.user_list = [];
    }
    onCreate(options) {
        console.log("Room created!", options);
    }
    onAuth(client, options) {
        console.log('authorizing...');
        var token = options.accessToken;
        var user = options.username;
        if (this.user_list.includes(user)) {
            console.log('user already in room!');
            return false;
        }
        this.user_list.push(user);
        return jsonwebtoken_1.default.verify(token, signingSecret, (err) => {
            if (err) {
                console.log('unauthorized join!');
                return false;
            }
            console.log('token authorized!');
            return true;
        });
    }
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
