import { WebSocketServer } from "ws"
import { getFolder, getContent, watchChange,saveFile,createFile } from "./Services/fileSystem.js";
import { TerminalManager } from "./Services/terminal.js";
import path from "path"
import url from "url"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const terminalmanager = new TerminalManager()
const wss = new WebSocketServer({ noServer: true });

export const initWs = (httpServer) => {
    httpServer.on('upgrade', (req, socket, head) => {
        console.log('New WebSocket connection');
        wss.handleUpgrade(req, socket, head, (socket) => {
            wss.emit('connection', socket, req);
        })
    })

    wss.on('connection', (socket, req) => {
        const parsedUrl = url.parse(req.url, true);
        let replId = parsedUrl.query.replId;
        initHandlers(socket, req, replId);
    });
}

const initHandlers = (socket, req, replId) => {
    try {
        socket.on('message', async (message) => {
            message = JSON.parse(message);
            console.log(`Received: ${message}`);
            let { type } = message
    
            if(type === 'get-terminal'){
                let { terminalId } = message
                terminalmanager.createTerminal(terminalId,replId,(data, id) => {
                    socket.send(JSON.stringify({ type: "terminal-output", data }))
                })
            }
            if (type === 'init-folder') {
                watchChange(`/workspace`, socket,async (path)=>{
                    await getFolder(path,(files)=>{
                        socket.send(JSON.stringify({type:"child-folder",files,currentDir:path}))
                    })
                })
                await getFolder(`/workspace/${replId}`, (files) => {
                    socket.send(JSON.stringify({ type: "files",files }))
                })
            }
    
            if (type === "terminal-input") {
                let { comd, terminalId } = message
                terminalmanager.write(terminalId, comd)
            }
    
            if (type === "get-content") {
                let { path } = message
                let name = path.split('/');
                name = name[name.length - 1];
                await getContent(path,(data)=>{
                    socket.send(JSON.stringify({type:"file-content",content:data,name,path,status:"saved"}))
                })
            }
            if(type === "get-folder"){
                let {currentDir} = message
                await getFolder(currentDir,(files)=>{
                    socket.send(JSON.stringify({type:"child-folder",files,currentDir}))
                })
            }

            if(type === "save-file"){
                let {path,content} = message
                await saveFile(path,content,(msg)=>{
                    socket.send(JSON.stringify({type:"acknowledge-save-file",status:msg}))
                })
            }

            if(type === "create-file"){
                let{name,path,ftype} = message
                await createFile(path,name,ftype);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}