import { readdir, readFile, writeFile, mkdir } from "fs/promises"
import { watch } from "fs"
import path from "path"

export const getFolder = async (currentDir, onData) => {
    try {
        let files = await readdir(currentDir, { withFileTypes: true });
        console.log(files);
        files = files.map((file) => {
            return {
                type: file.isDirectory() ? "dir" : "file",
                name: file.name,
                path: path.join(currentDir, file.name),
                status: "saved",
            };
        });

        onData(files)
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
};

export const getContent = async (path, onData) => {
    try {
        const data = await readFile(path, { encoding: "utf8" })
        onData(data);
    } catch (error) {
        console.log(error.message);
    }
}

export const watchChange = (Path, socket,onData) => {
    const watcher = watch(Path, { recursive: true }, (eventType, filename) => {
        if (eventType === 'rename') {
            console.log(filename);
            let p = `/workspace/${path.dirname(filename)}`
            console.log(p);
            onData(p)
            // socket.send(JSON.stringify({ type: "refetch-folder", path:p }))
        }
    });

    watcher.on('error', (error) => {
        console.error(`Watcher error: ${error}`);
        watcher.close();
    });

    socket.on('close', () => {
        watcher.close()
    })
};

export const saveFile = async (path, content, onData) => {
    try {
        await writeFile(path, content, "utf-8");
        onData("saved")
    } catch (error) {
        onData("not-saved")
    }
}

export const createFile = async (path, name, ftype) => {
    try {
        if (ftype === 'dir') {
            await mkdir(`${path}/${name}`, { recursive: true });
        } else {
            await writeFile(`${path}/${name}`, "", "utf-8");
        }
    } catch (error) {
        console.log(error.message);
    }
}