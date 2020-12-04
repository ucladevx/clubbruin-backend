const { Room, Client } = require("colyseus");
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Fish extends Schema {
    constructor(){
        super()
        this.x = Math.floor(Math.random() * 400);
        this.y = Math.floor(Math.random() * 400);
        this.username = "name"
    }
}
schema.defineTypes(Fish, {
    x: "number",
    y: "number",
    username:"string"
});

class Rod extends Schema {
    constructor(){
        super()
        this.x = Math.floor(Math.random() * 400);
        this.y = Math.floor(Math.random() * 400);
        this.username = "name"
    }
}
schema.defineTypes(Fish, {
    x: "number",
    y: "number",
    username:"string"
});

export class FishingRoom extends Room<GameState> {
    onCreate(options: any) {
        this.setState(new State())
    }

    onJoin(client: Client, options: any) {
    }

    onLeave(client: Client, consented: boolean) {
    }

    onDispose() {
    }
}