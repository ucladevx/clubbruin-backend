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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user');
const mongoose = require('mongoose');
const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater';
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    let token;
    try {
        const user = yield userModel.findOne({ username: username });
        if (!user) {
            res.status(401).json({
                message: 'Username does not exist.'
            });
        }
        console.log(user);
        let hashedPassword = user.password;
        let result = yield bcrypt.compare(password, hashedPassword);
        if (result === false) {
            res.status(401).json({
                message: 'Invalid credentials.'
            });
        }
        let email = user.email;
        token = jwt.sign({ username, email }, signingSecret, { expiresIn: "10 days" });
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
    res.status(200).json({
        message: 'Successfully logged in.',
        username,
        token
    });
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    // use client side validation and send non-empty username/email/password to backend
    if (password.length < 8) {
        return res.json({
            message: 'Invalid password. Must have at least 8 characters.'
        });
    }
    let hash;
    try {
        hash = yield bcrypt.hash(password, 10);
    }
    catch (err) {
        return res.json({
            message: err.message
        });
    }
    let token = jwt.sign({ username, email }, signingSecret, { expiresIn: "10 days" });
    const user = new userModel({
        username,
        email,
        password: hash,
        stupid: "hello"
    });
    try {
        yield user.save();
    }
    catch (err) {
        if (err.message.includes('duplicate') && err.message.includes('username')) {
            return res.json({
                message: 'Username taken. Create a different username.'
            });
        }
        else if (err.message.includes('duplicate') && err.message.includes('email')) {
            return res.json({
                message: 'Email already in use. Use a different one.'
            });
        }
        return res.json({
            message: err.message
        });
    }
    res.status(200).json({
        message: 'Signup successful',
        username,
        email,
        hash,
        token
    });
}));
module.exports = router;
