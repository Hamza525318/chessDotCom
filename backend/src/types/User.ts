import { Socket } from "socket.io";

export class User{
    id: string;
    email: string;
    socket: Socket

    constructor(id: string,email: string,socket: Socket){
        this.id = id;
        this.email = email;
        this.socket = socket;
    }
}