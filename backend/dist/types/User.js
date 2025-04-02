"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, socket) {
        this.id = id;
        this.email = email;
        this.socket = socket;
    }
}
exports.User = User;
