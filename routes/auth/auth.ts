import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user')
const mongoose = require('mongoose')

const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater'

router.post("/signin", async (req: Request, res: Response) => {

    const { username, password } = req.body

    let token
    try {
        const user = await userModel.findOne({ username: username })
        if (!user) {
            res.status(401).json({
                message: 'Username does not exist.'
            })
        }

        console.log(user)

        let hashedPassword = user.password;
        let result = await bcrypt.compare(password, hashedPassword);
        if (result === false) {
            res.status(401).json({
                message: 'Invalid credentials.'
            })
        }

        let email = user.email
        token = jwt.sign({ username, email }, signingSecret, { expiresIn: "10 days" })

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

    res.status(200).json({
        message: 'Successfully logged in.',
        username,
        token
    })
})
router.post("/signup", async (req: Request, res: Response) => {

    const { username, email, password } = req.body

    // use client side validation and send non-empty username/email/password to backend
    if (password.length < 8) {
        return res.json({
            message: 'Invalid password. Must have at least 8 characters.'
        })
    }

    let hash
    try {
        hash = await bcrypt.hash(password, 10);
    } catch (err) {
        return res.json({
            message: err.message
        })
    }

    let token = jwt.sign({ username, email }, signingSecret, { expiresIn: "10 days" });

    const user = new userModel({
        username,
        email,
        password: hash,
        stupid: "hello"
    })

    try {
        await user.save()
    } catch (err) {
        if (err.message.includes('duplicate') && err.message.includes('username')) {
            return res.json({
                message: 'Username taken. Create a different username.'
            })
        } else if (err.message.includes('duplicate') && err.message.includes('email')) {
            return res.json({
                message: 'Email already in use. Use a different one.'
            })
        }
        return res.json({
            message: err.message
        })
    }

    res.status(200).json({
        message: 'Signup successful',
        username,
        email,
        hash,
        token
    })
})

module.exports = router;