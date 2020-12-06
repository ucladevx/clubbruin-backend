const jwt = require('jsonwebtoken');
const { Room, Client } = require("colyseus");
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater'

class AuthRoom extends Room {
    onCreate(options) {
        console.log("AuthRoom created!", options);
    }

    onAuth(client, options, req) {
        console.log('authorizing...');
        var token = options.accessToken;
        return jwt.verify(token, signingSecret, (err) => {
            if(err){
                console.log('unauthorized join!');
                return false;
            }
            console.log('token authorized!');
            return true;
        });
    }

    onJoin(client, options) {
        console.log('joined room!')
    }

    onLeave(client) {
        console.log('left room!')
    }

    onDispose() {
        console.log("Dispose Room");
    }
}

module.exports = { AuthRoom }