"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = exports.State = exports.Player = void 0;
const schema_1 = require("@colyseus/schema");
const base_room_1 = require("./base-room");
class Player extends base_room_1.BasePlayer {
    constructor(username) {
        super(username);
    }
}
exports.Player = Player;
class State extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
    }
    createPlayer(sessionId, username) {
        this.players.set(sessionId, new Player(username));
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
}
__decorate([
    schema_1.type({ map: Player })
], State.prototype, "players", void 0);
exports.State = State;
class GameRoom extends base_room_1.BaseRoom {
    constructor() {
        super(...arguments);
        this.maxClients = 10;
    }
    onCreate(options) {
        console.log("GameRoom created!", options);
        this.setState(new State());
    }
    onJoin(client, options) {
        console.log("Joined GameRoom!");
        client.send("hello", "world");
        this.state.createPlayer(client.sessionId, options.username);
    }
    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }
    onDispose() {
        console.log("Dispose GameRoom");
    }
}
exports.GameRoom = GameRoom;
