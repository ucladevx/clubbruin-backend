import { Client } from 'colyseus'
import { Schema, type, MapSchema } from '@colyseus/schema';
import { BaseRoom, BasePlayer } from './base-room';

class Player extends BasePlayer {
    @type("number")
    x = Math.floor(Math.random() * 1);
    @type("number")
    y = Math.floor(Math.random() * 1);
    constructor(username: string) {
        super(username)
    }
}

class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    createPlayer(sessionId: string, username: string) {
        this.players.set(sessionId, new Player(username));
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    movePlayer(sessionId: string, movement: any) {
        if (movement.x) {
            this.players.get(sessionId).x += movement.x * 0.08;

        } else if (movement.y) {
            this.players.get(sessionId).y += movement.y * 0.08;
        }
    }
}

class MapRoom extends BaseRoom {
    maxClients = 10;

    onCreate(options: any) {
        console.log("MapRoom created!", options);

        this.setState(new State());

        this.onMessage("move", (client: Client, data: any) => {
            console.log("MapRoom received message from", client.sessionId, ":", data);
            this.state.movePlayer(client.sessionId, data);
        });
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

export { Player, State, MapRoom }