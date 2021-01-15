"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater';
exports.jwtCheck = function (req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        var token = req.headers.authorization.split(" ")[1];
        try {
            var decoded = jwt.verify(token, signingSecret);
            console.log(decoded);
            return next();
        }
        catch (err) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }
    }
    else {
        return res.status(401).json({
            message: "Missing Authorization header."
        });
    }
};
