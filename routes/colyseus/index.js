const path = require('path');
const router = require('express').Router();
router.get('/map', (req, res) => {
    // res.send("got map");
    res.sendFile(path.join(__dirname + '../../../utils/mock-frontend/map.html'));
});

router.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../utils/mock-frontend/game.html'));
});

// router.get('/game/:gameId', (req, res) => {
//     res.sendFile(path.join(__dirname + '../utils/mock-frontend/' + req.params.gameId + '.html'));
// });

module.exports = router;
