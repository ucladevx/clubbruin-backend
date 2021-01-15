const schema = require('@colyseus/schema');
const {BaseRoom } = require("./base-room");
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
    constructor(username) {
        super(username)
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

class GameRoom extends BaseRoom {
    maxClients = 10;

    onCreate(options) {
        console.log("GameRoom created!", options);
        this.setState(new State());
    }

    onJoin(client, options) {
        console.log("Joined GameRoom!")
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

module.exports = { Player, State, GameRoom }