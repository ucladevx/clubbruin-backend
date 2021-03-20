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
        // messageHist: any[] = [new Message("lasanya", "nessae 1", Date.now()), new Message("ish", "askfh 2", Date.now())];
        this.messageHist = [];
        this.disableChat = true;
        this.chatsLoaded = false;
        this.chatRoomId = "";
    }
    loadChats(chatRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chatsLoaded) {
                this.messageHist = yield chatModel.find({ chatRoom: chatRoomId });
                console.log(this.messageHist);
            }
        });
    }
    // beforeOnCreate() store chatId to some local variable
    beforeOnCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatId = options.chatId;
            // this.messageHist = await chatModel.find({ chatRoom: chatId })
            yield this.loadChats(chatId);
            this.chatRoomId = chatId;
            // listen for load more i.e. onMessage("load-more") https://docs.colyseus.io/server/room/
        });
    }
    onJoin(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(options.username + ' joined chat room!');
            let data = new MyMessage();
            yield this.loadChats(options.chatId);
            data.messageHist = this.messageHist;
            client.send("chat-hist", data.messageHist);
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
        this.messageHist.filter((mes) => mes.newMsg).forEach((mes) => __awaiter(this, void 0, void 0, function* () {
            console.log(mes);
            const chat = new chatModel({
                message: mes.message,
                username: mes.username,
                chatRoom: this.chatRoomId,
                timestamp: mes.timestamp
            });
            yield chat.save();
        }));
    }
}
exports.ChatRoom = ChatRoom;
