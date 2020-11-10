const { Room, Client } =  require("colyseus");
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
    x = Math.floor(Math.random() * 400);
    y = Math.floor(Math.random() * 400);
}
schema.defineTypes(Player, {
    x: "number",
    y: "number"
});

class State extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
    }

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }

    movePlayer(sessionId, movement) {
        if (movement.x) {
            this.players.get(sessionId).x += movement.x * 10;

        } else if (movement.y) {
            this.players.get(sessionId).y += movement.y * 10;
        }
    }
}
schema.defineTypes(State, {
    players: { map: Player }
});

class MapRoom extends Room {
    maxClients = 10;

    onCreate(options) {
        console.log("MapRoom created!", options);

        this.setState(new State());

        this.onMessage("move", (client, data) => {
            console.log("MapRoom received message from", client.sessionId, ":", data);
            this.state.movePlayer(client.sessionId, data);
        });
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
        console.log("Dispose MapRoom");
    }
}

module.exports = {Player, State, MapRoom}