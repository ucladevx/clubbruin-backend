import { Client } from 'colyseus'
import { Schema, type, MapSchema } from '@colyseus/schema';
import { BaseRoom, BasePlayer } from './base-room';
const chatModel = require('../../models/chat')
import { Message } from '../chat/index';

class ChatRoom extends BaseRoom {

    userList: string[] = [];
    messageHist: any[] = [];
    disableChat: boolean = true;

    // beforeOnCreate() store chatId to some local variable
    async beforeOnCreate(options: any) {
        let chatId = options.chatId;
        this.messageHist = await chatModel.findById({ chatId })
    }

    constructor() {
        super()
    }

    async onJoin(client: Client, options: any) {
        console.log(options.username + ' joined chat room!');

        // just send the messageHist to the client. type: chat-hist
        // this.broadcast("chat-recv", message, { except: client });
    }

    onLeave(client: Client) {
        console.log('left chat room!');
    }

    onDispose() {
        console.log("ChatRoom Disposed");
        this.messageHist.forEach(mes => {
            chatModel.insertOne({
                messages: mes.message,
                name: mes.username,
                chatRoom: mes.chatRoom, //use that local chatID variable here
                timestamp: mes.timestamp
            })
        })
    }
}

export { ChatRoom }