"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitsiRoom = exports.State = void 0;
const schema_1 = require("@colyseus/schema");
const base_room_1 = require("./base-room");
class State extends schema_1.Schema {
    constructor(id) {
        super();
        this.meetingUrl = "meet.jit.si" + "/" + id;
    }
}
__decorate([
    schema_1.type("string")
], State.prototype, "meetingUrl", void 0);
exports.State = State;
class JitsiRoom extends base_room_1.BaseRoom {
    onCreate(options) {
        super.onCreate(options);
        console.log("JitsiRoom created!", options);
        this.setState(new State(options.meetingid));
    }
    onJoin(client, options) {
    }
    onLeave(client) {
    }
    onDispose() {
        console.log("Dispose JitsiRoom");
    }
}
exports.JitsiRoom = JitsiRoom;
