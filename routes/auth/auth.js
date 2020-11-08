const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user')

const signingSecret = 'supersecretstringthatwillbestoredindotenvlater'

router.post("/signin", async (req, res) => {
    res.status(200).json({
        message: 'signin works'
    })
})
router.post("/signup", async (req, res) => {

    const { username, email, password } = req.body

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
        password: hash
    })

    try {
        await user.save()
    } catch (err) {
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