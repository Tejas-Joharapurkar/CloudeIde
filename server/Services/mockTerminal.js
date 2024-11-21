import { spawn } from "child_process"
import path from "path"
import fs from 'fs'
const editPath = (baesUrl, output) => {
    console.log(baesUrl);

    const maskedData = output.replace(new RegExp(baesUrl, 'g'), '')
    return maskedData
}

export const spwanTerminal = (comd, socket) => {
    var child = spawn(comd, { shell: true, cwd: 'childProject' });
    child.on('spawn', () => {
        console.log("spwand");
        child.stdin.write("pwd\n")
    })
    socket.on('message', (message) => {
        message = JSON.parse(message)
        const { type } = message
        if (type === 'terminal-input') {
            const { comd } = message
            console.log(comd);
            if (comd == 'stop') {
                child.stdin.write('pkill -f "node projectServer.js"\n');
            }else{
                child.stdin.write(`${comd} && pwd\n`)
            }
            // socket.send(comd)
        }
    })
    child.stdout.on('data', (data) => {
        if (data) {
            socket.send(JSON.stringify({ type: "terminal-output", data: data.toString() }));
        }
    });

    child.stderr.on('data', (data) => {
        if (data) {
            socket.send(JSON.stringify({ type: "terminal-output", data: data.toString() }));
        }
    });

    child.on('close', function (data) {
        if (data) {
            socket.send(JSON.stringify({ type: "terminal-output", data: data.toString() }))
        }
        console.log("bash killed");
    });

    socket.on('close', () => {
        child.kill("SIGINT")
        socket.send(JSON.stringify({ type: "terminal-output", data: `Process exited` }));
    })
}


