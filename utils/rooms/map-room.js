"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapRoom = exports.State = exports.Player = void 0;
const schema_1 = require("@colyseus/schema");
const base_room_1 = require("./base-room");
class Player extends base_room_1.BasePlayer {
    constructor(username) {
        super(username);
        this.x = Math.floor(Math.random() * 1);
        this.y = Math.floor(Math.random() * 1);
    }
}
__decorate([
    schema_1.type("number")
], Player.prototype, "x", void 0);
__decorate([
    schema_1.type("number")
], Player.prototype, "y", void 0);
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
    movePlayer(sessionId, movement) {
        if (movement.x) {
            this.players.get(sessionId).x += movement.x * 0.08;
        }
        else if (movement.y) {
            this.players.get(sessionId).y += movement.y * 0.08;
        }
    }
}
__decorate([
    schema_1.type({ map: Player })
], State.prototype, "players", void 0);
exports.State = State;
class MapRoom extends base_room_1.BaseRoom {
    constructor() {
        super(...arguments);
        this.maxClients = 10;
    }
    onCreate(options) {
        super.onCreate(options);
        console.log("MapRoom created!", options);
        this.setState(new State());
        this.onMessage("move", (client, data) => {
            console.log("MapRoom received message from", client.sessionId, ":", data);
            this.state.movePlayer(client.sessionId, data);
        });
    }
    onJoin(client, options) {
        client.send("hello", "world");
        this.state.createPlayer(client.sessionId, options.username);
    }
    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }
    onDispose() {
        console.log("Dispose MapRoom");
    }
}
exports.MapRoom = MapRoom;
