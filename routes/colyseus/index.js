"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var router = require('express').Router();
router.get('/map', function (req, res) {
    // res.send("got map");
    res.sendFile(path.join(__dirname + '../../../utils/mock-frontend/map.html'));
});
router.get('/game', function (req, res) {
    res.sendFile(path.join(__dirname + '/../../utils/mock-frontend/game.html'));
});
router.get('/auth-test', function (req, res) {
    res.sendFile(path.join(__dirname + '/../../utils/mock-frontend/auth.html'));
});
// router.get('/game/:gameId', (req, res) => {
//     res.sendFile(path.join(__dirname + '../utils/mock-frontend/' + req.params.gameId + '.html'));
// });
module.exports = router;
