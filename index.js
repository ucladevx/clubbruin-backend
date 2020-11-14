const express = require('express');
var serveIndex = require('serve-index');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const { Server, LobbyRoom, RelayRoom } = require('colyseus');
const { monitor } = require('@colyseus/monitor');
const { MapRoom } = require('./utils/rooms/map-room');
const { GameRoom } = require('./utils/rooms/game-room');


const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();

app.use(cors());
app.use(express.json());

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
    server: createServer(app),
    express: app,
    pingInterval: 0,
});

gameServer.define("map", MapRoom);
gameServer.define("game", GameRoom);

// (optional) attach web monitoring panel
app.use('/colyseus', monitor());
app.use('/map', function (req, res) {
    res.sendFile(path.join(__dirname + '/utils/mock-frontend/map.html'));
});
app.use('/game', function (req, res) {
    res.sendFile(path.join(__dirname + '/utils/mock-frontend/game.html'));
});

gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});

gameServer.listen(port);

// process.on("uncaughtException", (e) => {
//   console.log(e.stack);
//   process.exit(1);
// });

console.log(`Listening on http://localhost:${port}`);
