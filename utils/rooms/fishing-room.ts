import { Client } from "colyseus";
import { Schema, type, MapSchema } from '@colyseus/schema';
import { BaseRoom, BasePlayer } from './base-room';

const { Room } = require("colyseus");
//const ArraySchema = schema.ArraySchema;



function generateStartingPosition() {
    var startingPoint = Math.random();
    var multiplier = Math.random();
    if (multiplier >= 0.5) {return startingPoint * 15};
    return startingPoint * (-15)
  }

class Fish extends Schema {
    @type("number")
    x: number = Math.floor(Math.random() * 400);
    @type("number")
    y: number = generateStartingPosition();
    constructor(){
        super()
    }
}


class Rod extends Schema {
    @type("number")
    x: number =0;
    @type("number")
    y: number = 0;
    
}

class Player extends BasePlayer {
    @type("number")
    score: number =0;
    @type(Rod)
    rod: Rod = new Rod();
    constructor(username: string){
        super(username)
    }
}


class FishingState extends Schema {
    @type({ map: Fish })
    fishes = new MapSchema<Fish>();
    @type({ map: Player })
    players = new MapSchema<Player>();

    createFish(id: string, data: any ) {
        this.fishes.set(id,new Fish(data));
    }

    createPlayer(sessionId: string,username :string) {
        this.players.set(sessionId, new Player(username));
    }

    removePlayer(sessionId : string) {
        this.players.delete(sessionId);
    }

    moveRod(sessionId :string, data :any){
        if (data.x) {
            this.players.get(sessionId).rod.x += data.x;
            //console.log("x value: " + this.players.get(sessionId).rod.x);

        } else if (data.y) {
            this.players.get(sessionId).rod.y += data.y;
            //console.log("y value: " + this.players.get(sessionId).rod.y)
        }

    }
    // remove fish when rod grabs it, increment players score as well
    removeFish(fishId:string, data : any){
        //this.fishes.get(data.i).y -= 1000;
        this.fishes.get(fishId). y -=1000;
    }

    fishDisappeared(sessionId :string){

    }

    gameOver(sessionId: string){

    }


}



class FishingRoom extends BaseRoom {
    // initializes game state and has event listeners
    onCreate(options : any) {
        this.setState(new FishingState())
        console.log("fishing room created!!!")
        this.onMessage("moveRod", (client: Client, data: any) => {
            this.state.moveRod(client.sessionId, data);
        });

        this.onMessage("removeFish", (client : Client, data : any) => {
            this.state.removeFish(client.sessionId, data);
        });
    }
    
    onAuth(client: Client, options:any){
        return true;
    }
    
    // when a new player joins, intialize rod for them
    onJoin(client: Client, options : any) {
        this.state.createPlayer(client.sessionId);

    }
    // when a player leaves, remove their rod 
    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }
    // on dispose add player score to db 
    onDispose() {
    }
}

export {  Rod, Player, FishingState, FishingRoom}