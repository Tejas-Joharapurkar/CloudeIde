import pty from "node-pty"
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class TerminalManager {
    sessions = {}

    constructor() {
        this.sessions = {};
    }

    createTerminal(terminalId, replId, onData) {
        console.log("Creating terminal with replId:", replId);
        try {
            // Attempt to spawn the terminal
            const terminal = pty.spawn("bash",[], {
                cols: 100,
                name: 'xterm',
                cwd: `/workspace/${replId}`,
                env: process.env
            });
            
            console.log("Terminal created successfully:", terminalId);

            terminal.onData((data) => {
                console.log("Data from bash:", data); 
                onData(data, terminal.pid);
            });

            this.sessions[terminalId] = {
                terminal,
                replId
            };

            terminal.on('exit', (code) => {
                console.log(`Terminal exited with code ${code}`);
                delete this.sessions[terminalId];
            });
            

            return terminal;
        } catch (error) {
            console.error("Failed to create terminal:", error);
        }
    }

    write(terminalId,data){
        this.sessions[terminalId]?.terminal.write(data)
    }
    clear(terminalId) {
        this.sessions[terminalId].terminal.kill();
        delete this.sessions[terminalId];
    }
}