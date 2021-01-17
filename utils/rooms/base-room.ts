import { Client } from "colyseus";
const jwt = require('jsonwebtoken');
const { Room, Client } = require("colyseus");
import {Schema, type } from '@colyseus/schema';
const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater'

class BasePlayer extends Schema {
    @type("string")
    username: string = ""
    constructor(username: string) {
        super()
        this.username = username
    }
}

class BaseRoom extends Room {
    user_list: string[] = [];

    onCreate(options: any) {
        console.log("Room created!", options);
    }

    onAuth(client: Client, options: any) {
        console.log('authorizing...');
        var token: string = options.accessToken;
        var user: string = options.username;
        if (this.user_list.includes(user)) {
            console.log('user already in room!');
            return false;
        }
        this.user_list.push(user);
        return jwt.verify(token, signingSecret, (err: Error) => {
            if (err) {
                console.log('unauthorized join!');
                return false;
            }
            console.log('token authorized!');
            return true;
        });
    }

    onJoin(client: Client, options: any) {
        console.log(options.username + ' joined room!');
    }

    onLeave(client: Client) {
        console.log('left room!');
    }

    onDispose() {
        console.log("Room Disposed");
    }
}

module.exports = { BaseRoom, BasePlayer }