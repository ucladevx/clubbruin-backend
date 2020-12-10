const { Room, Client } = require("colyseus");
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;
const MapSchema = schema.MapSchema;

const size = window.screen.width;
var lim = (window.screen.width / window.screen.height) * 15;

function generateStartingPosition() {
    var startingPoint = Math.random();
    var multiplier = Math.random();
    if (multiplier >= 0.5) {return startingPoint * 15};
    return startingPoint * (-15)
  }

class Fish extends Schema {

    constructor(){
        super()

        this.x = Math.floor(Math.random() * 400);
        this.y = generateStartingPosition();
    }
}
schema.defineTypes(Fish, {
    x: "number",
    y: "number",
});

class Rod extends Schema {

    constructor(){
        super()
        this.x = 0;
        this.y = 0;
    }
}
schema.defineTypes(Rod, {
    x: "number",
    y: "number",
});

class Player extends Schema {
    constructor() {
        super()
        this.username = "name";
        this.score = 0;
    }
}
schema.defineTypes(Player, {
    username: "string",
    score: "number"
});

class FishingState extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
        this.fishes = new ArraySchema();
        this.rods = new ArraySchema();
    }

    createPlayer(sessionId) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }

    moveRod(sessionId, data){
        if (data.x) {
            this.rods.get(sessionId).x += movement.x;

        } else if (movement.y) {
            this.rods.get(sessionId).y += movement.y;
        }

    }
    // remove fish when rod grabs it, increment players score as well
    removeFish(sessionId){

    }


}
schema.defineTypes(FishingState, {
    players: { map: Player }, 
    fishes: [ Fish ]
});
export class FishingRoom extends Room<GameState> {
    // initializes game state and has event listeners
    onCreate(options: any) {
        this.setState(new FishingState())

        this.onMessage("moveRod", (client, data) => {
            this.state.movePlayer(client.sessionId, data);
        });
    }
    // when a new player joins, intialize rod for them
    onJoin(client: Client, options: any) {
        this.state.createPlayer(client.sessionId);

    }
    // when a player leaves, remove their rod 
    onLeave(client: Client, consented: boolean) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
    }
}