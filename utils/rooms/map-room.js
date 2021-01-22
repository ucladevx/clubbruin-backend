"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require("colyseus"), Room = _a.Room, Client = _a.Client;
var schema = require('@colyseus/schema');
var Schema = schema.Schema;
var MapSchema = schema.MapSchema;
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(username) {
        var _this = _super.call(this) || this;
        _this.x = Math.floor(Math.random() * 1);
        _this.y = Math.floor(Math.random() * 1);
        _this.username = username;
        return _this;
    }
    return Player;
}(Schema));
schema.defineTypes(Player, {
    x: "number",
    y: "number",
    username: "string"
});
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    function State() {
        var _this = _super.call(this) || this;
        _this.something = "This attribute won't be sent to the client-side";
        _this.players = new MapSchema();
        return _this;
    }
    State.prototype.createPlayer = function (sessionId, username) {
        this.players.set(sessionId, new Player(username));
    };
    State.prototype.removePlayer = function (sessionId) {
        this.players.delete(sessionId);
    };
    State.prototype.movePlayer = function (sessionId, movement) {
        if (movement.x) {
            this.players.get(sessionId).x += movement.x * 0.08;
        }
        else if (movement.y) {
            this.players.get(sessionId).y += movement.y * 0.08;
        }
    };
    return State;
}(Schema));
schema.defineTypes(State, {
    players: { map: Player }
});
var MapRoom = /** @class */ (function (_super) {
    __extends(MapRoom, _super);
    function MapRoom() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maxClients = 10;
        return _this;
    }
    MapRoom.prototype.onCreate = function (options) {
        var _this = this;
        console.log("MapRoom created!", options);
        this.setState(new State());
        this.onMessage("move", function (client, data) {
            console.log("MapRoom received message from", client.sessionId, ":", data);
            _this.state.movePlayer(client.sessionId, data);
        });
    };
    MapRoom.prototype.onAuth = function (client, options, req) {
        return true;
    };
    MapRoom.prototype.onJoin = function (client, options) {
        client.send("hello", "world");
        this.state.createPlayer(client.sessionId, options.username);
    };
    MapRoom.prototype.onLeave = function (client) {
        this.state.removePlayer(client.sessionId);
    };
    MapRoom.prototype.onDispose = function () {
        console.log("Dispose MapRoom");
    };
    return MapRoom;
}(Room));
module.exports = { Player: Player, State: State, MapRoom: MapRoom };
