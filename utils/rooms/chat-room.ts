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
    // messageHist: any[] = [new Message("lasanya", "nessae 1", Date.now()), new Message("ish", "askfh 2", Date.now())];
    messageHist: any[] = [];
    disableChat: boolean = true;
    chatsLoaded: boolean = false;
    chatRoomId: string = ""

    async loadChats(chatRoomId: String) {
        if (!this.chatsLoaded) {
            this.messageHist = await chatModel.find({ chatRoom: chatRoomId })
            console.log(this.messageHist)
        }
    }

    // beforeOnCreate() store chatId to some local variable
    async beforeOnCreate(options: any) {
        let chatId = options.chatId;
        // this.messageHist = await chatModel.find({ chatRoom: chatId })

        await this.loadChats(chatId)
        this.chatRoomId = chatId;
        // listen for load more i.e. onMessage("load-more") https://docs.colyseus.io/server/room/
    }

    constructor() {
        super()
    }

    async onJoin(client: Client, options: any) {
        console.log(options.username + ' joined chat room!');

        let data = new MyMessage();

        await this.loadChats(options.chatId);

        data.messageHist = this.messageHist;
        client.send("chat-hist", data.messageHist);

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
        this.messageHist.filter((mes) => mes.newMsg).forEach(async mes => {
            console.log(mes)
            const chat = new chatModel({
                message: mes.message,
                username: mes.username,
                chatRoom: this.chatRoomId, //use that local chatID variable here
                timestamp: mes.timestamp
            })
            await chat.save()
        })
    }
}

export { ChatRoom }