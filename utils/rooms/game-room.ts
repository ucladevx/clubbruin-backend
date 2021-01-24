import { Schema, MapSchema, type } from '@colyseus/schema'
import { BaseRoom, BasePlayer } from './base-room'
import { Client } from 'colyseus'

class Player extends BasePlayer {
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
}

class GameRoom extends BaseRoom {
    maxClients = 10;

    onCreate(options: any) {
        console.log("GameRoom created!", options);
        this.setState(new State());
    }

    onJoin(client: Client, options: any) {
        console.log("Joined GameRoom!")
        client.send("hello", "world");
        this.state.createPlayer(client.sessionId, options.username);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log("Dispose GameRoom");
    }
}

export { Player, State, GameRoom }