"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var userModel = require('../../models/user');
var mongoose = require('mongoose');
var signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater';
router.post("/signin", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, token, user, hashedPassword, result, email, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userModel.findOne({ username: username })];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(401).json({
                        message: 'Username does not exist.'
                    });
                }
                console.log(user);
                hashedPassword = user.password;
                return [4 /*yield*/, bcrypt.compare(password, hashedPassword)];
            case 3:
                result = _b.sent();
                if (result === false) {
                    res.status(401).json({
                        message: 'Invalid credentials.'
                    });
                }
                email = user.email;
                token = jwt.sign({ username: username, email: email }, signingSecret, { expiresIn: "10 days" });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                res.status(400).json({
                    message: err_1.message
                });
                return [3 /*break*/, 5];
            case 5:
                res.status(200).json({
                    message: 'Successfully logged in.',
                    username: username,
                    token: token
                });
                return [2 /*return*/];
        }
    });
}); });
router.post("/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, hash, err_2, token, user, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                // use client side validation and send non-empty username/email/password to backend
                if (password.length < 8) {
                    return [2 /*return*/, res.json({
                            message: 'Invalid password. Must have at least 8 characters.'
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 2:
                hash = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                return [2 /*return*/, res.json({
                        message: err_2.message
                    })];
            case 4:
                token = jwt.sign({ username: username, email: email }, signingSecret, { expiresIn: "10 days" });
                user = new userModel({
                    username: username,
                    email: email,
                    password: hash,
                    stupid: "hello"
                });
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, user.save()];
            case 6:
                _b.sent();
                return [3 /*break*/, 8];
            case 7:
                err_3 = _b.sent();
                if (err_3.message.includes('duplicate') && err_3.message.includes('username')) {
                    return [2 /*return*/, res.json({
                            message: 'Username taken. Create a different username.'
                        })];
                }
                else if (err_3.message.includes('duplicate') && err_3.message.includes('email')) {
                    return [2 /*return*/, res.json({
                            message: 'Email already in use. Use a different one.'
                        })];
                }
                return [2 /*return*/, res.json({
                        message: err_3.message
                    })];
            case 8:
                res.status(200).json({
                    message: 'Signup successful',
                    username: username,
                    email: email,
                    hash: hash,
                    token: token
                });
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
