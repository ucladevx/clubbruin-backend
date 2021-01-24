import { Request, Response } from "express";
import path = require('path');
import * as express from 'express';
const router = express.Router();

router.get('/map', (req: Request, res: Response) => {
    // res.send("got map");
    res.sendFile(path.join(__dirname + '../../../utils/mock-frontend/map.html'));
});

router.get('/game', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/../../utils/mock-frontend/game.html'));
});

router.get('/base-test', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/../../utils/mock-frontend/base.html'));
});

// router.get('/game/:gameId', (req, res) => {
//     res.sendFile(path.join(__dirname + '../utils/mock-frontend/' + req.params.gameId + '.html'));
// });

export {router}
