"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient.on('error', (err) => {
    console.log("Error in Redis " + err);
});
redisClient.connect();
exports.default = redisClient;
