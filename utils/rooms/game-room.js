const { Room, Client } = require("colyseus");
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
    constructor() {
        super()
        this.username = "name"
    }
}
schema.defineTypes(Player, {
    username: "string"
});

class State extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
    }

    createPlayer(sessionId) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
}
schema.defineTypes(State, {
    players: { map: Player }
});

class GameRoom extends Room {
    maxClients = 10;

    onCreate(options) {
        console.log("GameRoom created!", options);
        this.setState(new State());
    }

    onAuth(client, options, req) {
        return true;
    }

    onJoin(client) {
        client.send("hello", "world");
        this.state.createPlayer(client.sessionId);
    }

    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log("Dispose GameRoom");
    }
}

module.exports = { Player, State, GameRoom }