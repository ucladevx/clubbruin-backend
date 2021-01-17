"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var _a = require("colyseus"), Room = _a.Room, Client = _a.Client;
var schema_1 = require("@colyseus/schema");
var signingSecret = process.env.JWT_SECRET || 'supersecretstringthatwillbestoredindotenvlater';
var BasePlayer = /** @class */ (function (_super) {
    __extends(BasePlayer, _super);
    function BasePlayer(username) {
        var _this = _super.call(this) || this;
        _this.username = "";
        _this.username = username;
        return _this;
    }
    __decorate([
        schema_1.type("string")
    ], BasePlayer.prototype, "username", void 0);
    return BasePlayer;
}(schema_1.Schema));
var BaseRoom = /** @class */ (function (_super) {
    __extends(BaseRoom, _super);
    function BaseRoom() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.user_list = [];
        return _this;
    }
    BaseRoom.prototype.onCreate = function (options) {
        console.log("Room created!", options);
    };
    BaseRoom.prototype.onAuth = function (client, options) {
        console.log('authorizing...');
        var token = options.accessToken;
        var user = options.username;
        if (this.user_list.includes(user)) {
            console.log('user already in room!');
            return false;
        }
        this.user_list.push(user);
        return jwt.verify(token, signingSecret, function (err) {
            if (err) {
                console.log('unauthorized join!');
                return false;
            }
            console.log('token authorized!');
            return true;
        });
    };
    BaseRoom.prototype.onJoin = function (client, options) {
        console.log(options.username + ' joined room!');
    };
    BaseRoom.prototype.onLeave = function (client) {
        console.log('left room!');
    };
    BaseRoom.prototype.onDispose = function () {
        console.log("Room Disposed");
    };
    return BaseRoom;
}(Room));
module.exports = { BaseRoom: BaseRoom, BasePlayer: BasePlayer };
