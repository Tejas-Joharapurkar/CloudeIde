import { spawn } from "child_process"

const editPath = (baesUrl, output) => {
    console.log(baesUrl);

    const maskedData = output.replace(new RegExp(baesUrl, 'g'), '')
    return maskedData
}

export const spwanTerminal = (comd, socket) => {

    var child = spawn(comd, { shell: true, cwd: 'D:\\cloudIde\\server\\childProject' });

    socket.on('message', (message) => {
        console.log(JSON.parse(message).comd);
        child.stdin.write(`${JSON.parse(message).comd}\n`)
    })

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        data = data.toString();
        data = editPath(process.cwd(), data);
        socket.send(data)
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        data = data.toString();
        data = editPath(process.cwd(), data);
        socket.send(data)
    });

    child.on('close', function (code) {
        socket.send(code)
    });

}


