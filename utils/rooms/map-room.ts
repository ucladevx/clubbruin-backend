import { Client } from "colyseus";
import { Request } from "express";

const { Room, Client } = require("colyseus");
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

interface Movement {
    x: number;
    y: number;
}

class Player extends Schema {
    constructor(username: string) {
        super()
        this.x = Math.floor(Math.random() * 1);
        this.y = Math.floor(Math.random() * 1);
        this.username = username
    }
}
schema.defineTypes(Player, {
    x: "number",
    y: "number",
    username: "string"
});

class State extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
    }

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string, username: string) {
        this.players.set(sessionId, new Player(username));
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    movePlayer(sessionId: string, movement: Movement) {
        if (movement.x) {
            this.players.get(sessionId).x += movement.x * 0.08;

        } else if (movement.y) {
            this.players.get(sessionId).y += movement.y * 0.08;
        }
    }
}
schema.defineTypes(State, {
    players: { map: Player }
});

class MapRoom extends Room {
    maxClients = 10;

    onCreate(options: any) {
        console.log("MapRoom created!", options);

        this.setState(new State());

        this.onMessage("move", (client: Client, data: any) => {
            console.log("MapRoom received message from", client.sessionId, ":", data);
            this.state.movePlayer(client.sessionId, data);
        });
    }

    onAuth(client: Client, options: any, req: Request) {
        return true;
    }

    onJoin(client: Client, options: any) {
        client.send("hello", "world");
        this.state.createPlayer(client.sessionId, options.username);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log("Dispose MapRoom");
    }
}

module.exports = { Player, State, MapRoom }