"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FishingRoom = exports.FishingState = exports.Player = exports.Rod = void 0;
const schema_1 = require("@colyseus/schema");
const base_room_1 = require("./base-room");
const { Room } = require("colyseus");
//const ArraySchema = schema.ArraySchema;
function generateStartingPosition() {
    var startingPoint = Math.random();
    var multiplier = Math.random();
    if (multiplier >= 0.5) {
        return startingPoint * 15;
    }
    ;
    return startingPoint * (-15);
}
class Fish extends schema_1.Schema {
    constructor(data) {
        super();
        this.x = Math.floor(Math.random() * 400);
        this.y = generateStartingPosition();
        this.speed = data;
    }
}
__decorate([
    schema_1.type("number")
], Fish.prototype, "x", void 0);
__decorate([
    schema_1.type("number")
], Fish.prototype, "y", void 0);
__decorate([
    schema_1.type("number")
], Fish.prototype, "speed", void 0);
class Rod extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.x = 0;
        this.y = 0;
    }
}
__decorate([
    schema_1.type("number")
], Rod.prototype, "x", void 0);
__decorate([
    schema_1.type("number")
], Rod.prototype, "y", void 0);
exports.Rod = Rod;
class Player extends base_room_1.BasePlayer {
    constructor(username) {
        super(username);
        this.score = 0;
        this.rod = new Rod();
    }
}
__decorate([
    schema_1.type("number")
], Player.prototype, "score", void 0);
__decorate([
    schema_1.type(Rod)
], Player.prototype, "rod", void 0);
exports.Player = Player;
class FishingState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.fishes = new schema_1.MapSchema();
        this.players = new schema_1.MapSchema();
    }
    // creates a fish with id as array num and speed as parameter
    createFish(data) {
        this.fishes.set(data.id, new Fish(data.speed));
    }
    //update location of fish 
    moveFish() {
        this.fishes.forEach((key, value) => {
            console.log(value);
            console.log(key);
        });
        //this.fishes.get(id).x -= this.fishes.get(id).speed; 
        //console.log("fish moved with id:" + id )
    }
    createPlayer(sessionId, username) {
        this.players.set(sessionId, new Player(username));
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
    moveRod(sessionId, data) {
        if (data.x) {
            this.players.get(sessionId).rod.x += data.x;
            //console.log("x value: " + this.players.get(sessionId).rod.x);
        }
        else if (data.y) {
            this.players.get(sessionId).rod.y += data.y;
            //console.log("y value: " + this.players.get(sessionId).rod.y)
        }
    }
    // remove fish when rod grabs it, increment players score as well
    removeFish(fishId, data) {
        //this.fishes.get(data.i).y -= 1000;
        this.fishes.get(fishId).y -= 1000;
    }
    fishDisappeared(sessionId) {
    }
    gameOver(sessionId) {
    }
}
__decorate([
    schema_1.type({ map: Fish })
], FishingState.prototype, "fishes", void 0);
__decorate([
    schema_1.type({ map: Player })
], FishingState.prototype, "players", void 0);
exports.FishingState = FishingState;
class FishingRoom extends base_room_1.BaseRoom {
    // initializes game state and has event listeners
    // create fish array 
    // use beforeoncreate
    // frontend loads state from fish initial
    beforeOnCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState(new FishingState());
            console.log("fishing room created!!!");
            this.onMessage("createFish", (client, data) => {
                this.state.createFish(data);
                console.log("fish created " + data.id);
            });
            this.onMessage("moveFish", (client, data) => {
                this.state.moveFish();
            });
            this.onMessage("moveRod", (client, data) => {
                this.state.moveRod(client.sessionId, data);
            });
            this.onMessage("removeFish", (client, data) => {
                this.state.removeFish(client.sessionId, data);
            });
        });
    }
    constructor() {
        super();
    }
    // not needed
    onAuth(client, options) {
        return true;
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
exports.FishingRoom = FishingRoom;
