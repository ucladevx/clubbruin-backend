import { Client } from 'colyseus'
import { Schema, type, MapSchema } from '@colyseus/schema';
import { BaseRoom, BasePlayer } from './base-room';
const chatModel = require('../../models/chat')
import { Message } from '../chat/index';


// https://docs.colyseus.io/server/client/
class MyMessage extends Schema {
    messageHist!: Array<Message>;
}

class ChatRoom extends BaseRoom {

    userList: string[] = [];
    messageHist: any[] = [];
    disableChat: boolean = true;

    // beforeOnCreate() store chatId to some local variable
    async beforeOnCreate(options: any) {
        let chatId = options.chatId;
        this.messageHist = await chatModel.findById({ chatId })

        // listen for load more i.e. onMessage("load-more") https://docs.colyseus.io/server/room/
    }

    constructor() {
        super()
    }

    async onJoin(client: Client, options: any) {
        console.log(options.username + ' joined chat room!');

        let data = new MyMessage();
        data.messageHist = this.messageHist;
        client.send("chat-hist", data);

        // paginate here? mongo-cursor-pagination.
        // send next page over

        // just send the messageHist to the client. type: chat-hist
        // this.broadcast("chat-hist", this.messageHist);
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
                // chatRoom: mes.chatRoom, //use that local chatID variable here
                timestamp: mes.timestamp
            })
        })
    }
}

export { ChatRoom }