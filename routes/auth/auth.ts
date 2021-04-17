import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user')
const mongoose = require('mongoose')

const signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater'

const isUndefined = (payload: any) => {
    if (payload === null || payload === undefined || payload === "") {
        return true
    }
    return false
}

router.post("/signin", async (req: Request, res: Response) => {

    const { username, password } = req.body

    if (isUndefined(username) || isUndefined(password)) {
        return res.status(400).json({
            message: "Username or password not provided."
        })
    }

    let token
    try {
        const user = await userModel.findOne({ username: username })
        if (!user) {
            console.log(user)
            return res.status(401).json({
                message: 'Username does not exist.'
            })
        }

        console.log(user)

        let hashedPassword = user.password;
        let result = await bcrypt.compare(password, hashedPassword);
        if (result === false) {
            return res.status(401).json({
                message: 'Invalid credentials.'
            })
        }

        let email = user.email
        token = jwt.sign({ username, email }, signingSecret, { expiresIn: "10 days" })

    } catch (err) {
        return res.status(400).json({
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

    if (isUndefined(username) || isUndefined(password)) {
        return res.status(400).json({
            message: "Username or password not provided."
        })
    }

    // use client side validation and send non-empty username/email/password to backend
    if (password.length < 8) {
        return res.status(400).json({
            message: 'Invalid password. Must have at least 8 characters.'
        })
    }

    let hash
    try {
        hash = await bcrypt.hash(password, 10);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }

    let token = jwt.sign({ username, email }, signingSecret, { expiresIn: "10 days" });

    const user = new userModel({
        username,
        email,
        password: hash,
        stupid: "hello" // ?
    })

    try {
        await user.save()
    } catch (err) {
        if (err.message.includes('duplicate') && err.message.includes('username')) {
            return res.status(406).json({
                message: 'Username taken. Create a different username.'
            })
        } else if (err.message.includes('duplicate') && err.message.includes('email')) {
            return res.status(406).json({
                message: 'Email already in use. Use a different one.'
            })
        }
        return res.status(500).json({
            message: err.message
        })
    }

    res.status(201).json({
        message: 'Signup successful',
        username,
        email,
        hash,
        token
    })
})

module.exports = router;