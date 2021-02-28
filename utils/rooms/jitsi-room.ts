import { Room, Client } from 'colyseus'
import { Schema, type } from '@colyseus/schema'
import { BaseRoom, BasePlayer } from './base-room';

class State extends Schema {
    @type("string")
    meetingUrl: string
    constructor(id: string){
        super()
        this.meetingUrl = "meet.jit.si" + "/" + id;
    }
}

class JitsiRoom extends BaseRoom {
    onCreate(options: any) {
        super.onCreate(options)
        console.log("MapRoom created!", options);
        this.setState(new State(this.roomId));
        
    }

    onJoin(client: Client, options: any) {
    }

    onLeave(client: Client) {
    }

    onDispose() {
        console.log("Dispose JitsiRoom");
    }
}
export {State, JitsiRoom }