const express = require('express');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const { Server, LobbyRoom, RelayRoom } = require('colyseus');
const { monitor } = require('@colyseus/monitor');
const { MapRoom } = require('./utils/rooms/map-room');
const { GameRoom } = require('./utils/rooms/game-room');
const { ColyseusRoutes } = require('./routes/colyseus/index')

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
app.use('/', ColyseusRoutes);

gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});

gameServer.listen(port);

console.log(`Listening on http://localhost:${port}`);
