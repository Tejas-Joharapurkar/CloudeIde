import express, { json } from "express"
import cors from "cors"
import { initWs } from "./ws.js";
const server = express();
server.use(express.json());
server.use(cors());

server.get('/health',(req,res)=>{
    console.log("polling request hit");
    res.status(201).send(`request accepted from ${req.headers.host}`)
})
const httpServer = server.listen(8000, () => {
    console.log("server running on port 8000");
})

initWs(httpServer)




