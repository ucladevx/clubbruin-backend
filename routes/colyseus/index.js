"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const path = require("path");
const express = __importStar(require("express"));
const router = express.Router();
exports.router = router;
router.get('/map', (req, res) => {
    // res.send("got map");
    res.sendFile(path.join(__dirname + '../../../utils/mock-frontend/map.html'));
});
router.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../utils/mock-frontend/game.html'));
});
router.get('/base-test', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../utils/mock-frontend/base.html'));
});
