const { Room, Client } = require("colyseus");
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;
const MapSchema = schema.MapSchema;



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
        this.rod = new Rod();
    }
}
schema.defineTypes(Player, {
    username: "string",
    score: "number",
    rod: Rod
});

class FishingState extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
        this.fishes = new ArraySchema();
        
    }

    createPlayer(sessionId) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }

    moveRod(sessionId, data){
        if (data.x) {
            this.players.get(sessionId).rod.x += data.x;

        } else if (data.y) {
            this.players.get(sessionId).rod.y += data.y;
        }

    }
    // remove fish when rod grabs it, increment players score as well
    removeFish(sessionId, data){
        //this.fishes.get(data.i).y -= 1000;
        this.players.get(sessionId).score += 1; 
    }

    fishDisappeared(sessionId){

    }

    gameOver(sessionId){

    }


}

schema.defineTypes(FishingState, {
    players: { map: Player }, 
    fishes: [ Fish ]
});

class FishingRoom extends Room {
    // initializes game state and has event listeners
    onCreate(options) {
        this.setState(new FishingState())

        this.onMessage("moveRod", (client, data) => {
            this.state.movePlayer(client.sessionId, data);
        });
    }
    // when a new player joins, intialize rod for them
    onJoin(client, options) {
        this.state.createPlayer(client.sessionId);

    }
    // when a player leaves, remove their rod 
    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }
    // on dispose add player score to db 
    onDispose() {
    }
}