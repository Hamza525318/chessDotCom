import express from 'express';
import http from 'http';
import {Server} from  "socket.io";
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET','POST']
    }
})

app.use(cors());
app.use(express.json());

app.get("/",(req: any,res: any)=>{
    res.send("Welcome to chess.com backen")
})

server.listen(process.env.PORT,()=>{
    console.log("SERVER RUNNING ON PORT: "+process.env.PORT)
})