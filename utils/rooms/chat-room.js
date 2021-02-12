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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
const schema_1 = require("@colyseus/schema");
const base_room_1 = require("./base-room");
const chatModel = require('../../models/chat');
// https://docs.colyseus.io/server/client/
class MyMessage extends schema_1.Schema {
}
class ChatRoom extends base_room_1.BaseRoom {
    constructor() {
        super();
        this.userList = [];
        this.messageHist = [];
        this.disableChat = true;
    }
    // beforeOnCreate() store chatId to some local variable
    beforeOnCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatId = options.chatId;
            this.messageHist = yield chatModel.findById({ chatId });
            // listen for load more i.e. onMessage("load-more") https://docs.colyseus.io/server/room/
        });
    }
    onJoin(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(options.username + ' joined chat room!');
            let data = new MyMessage();
            data.messageHist = this.messageHist;
            client.send("chat-hist", data);
            // paginate here? mongo-cursor-pagination.
            // send next page over
            // just send the messageHist to the client. type: chat-hist
            // this.broadcast("chat-hist", this.messageHist);
        });
    }
    onLeave(client) {
        console.log('left chat room!');
    }
    onDispose() {
        console.log("ChatRoom Disposed");
        this.messageHist.forEach(mes => {
            chatModel.insertOne({
                messages: mes.message,
                name: mes.username,
                chatRoom: mes.chatRoom,
                timestamp: mes.timestamp
            });
        });
    }
}
exports.ChatRoom = ChatRoom;
