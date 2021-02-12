import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user')
const mongoose = require('mongoose')

router.post("/something", async (req: Request, res: Response) => {
    res.status(200).json({
        message: "hello"
    })
})

module.exports = router;