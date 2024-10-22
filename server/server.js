import express from "express"
const server = express();
import { spwanTerminal } from './Services/mockTerminal.js';
import { WebSocketServer } from "ws"
import url from "url"
server.use(express.json());

const httpServer = server.listen(8000, () => {
    console.log("server running on port 8000");
})

export const wss = new WebSocketServer({ noServer: true });

server.get('/terminal', (req, res) => {
    res.send("main server")
})
httpServer.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (socket) => {
        const query = url.parse(req.url, true).query;
        const { comd } = query
        wss.emit('connection', socket, req);
        const process = spwanTerminal(comd, socket)
        console.log(`upgrade request`);
    })
})


