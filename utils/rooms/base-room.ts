import jwt from 'jsonwebtoken'
import { Room, Client } from 'colyseus'
import { Schema, type } from '@colyseus/schema'
import { Message } from '../chat/index';
const userModel = require('../../models/user')
const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater'

class BasePlayer extends Schema {
    @type("string")
    username: string
    @type("string")
    major: string
    @type("number")
    year: number
    constructor(username: string) {
        super()
        this.username = username
        this.major = ''
        this.year = 0
        this.importDBValues(username)
    }

    //pull all required values from database
    async importDBValues(username: string) {
        const user = await userModel.findOne({ username: username })
        if (!user) {
            console.log("user does not exist!")
            return
        }
        this.major = user.major
        this.year = user.year
    }
}

class BaseRoom extends Room {
    userList: string[] = [];
    messageHist: any[] = [];
    disableChat: boolean = false;

    // declare b4OnCreate() here -> noop here

    beforeOnCreate(options: any) {

    }

    constructor() {
        super()
    }

    onCreate(options: any) {
        this.beforeOnCreate(options)

        console.log("Base generated");
        this.onMessage("chat-send", (client: Client, data: any) => {
            console.log("Client (", client.sessionId, ") sent message: ", data);
            var message = new Message(options.username, data, Date.now())
            this.messageHist.push(message)
            this.broadcast("chat-recv", message, { except: client });
        });
        this.onMessage("chat-recv", (client: Client, data: any) => {
            console.log("Client (", client.sessionId, ") recieved message: ", data.message)
        });
    }

    // Authorize with JWT
    onAuth(client: Client, options: any) {
        console.log('authorizing...');
        var token: string = options.accessToken;
        var user: string = options.username;
        if (this.userList.includes(user)) {
            console.log('user already in room!');
            return false;
        }
        this.userList.push(user);
        return jwt.verify(token, signingSecret, (err) => {
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

export { BaseRoom, BasePlayer }