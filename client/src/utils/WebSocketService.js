class WebSocketService {
    static instance = null;
    socket = null;
    listners = new Map();
    isConnected = false;
    bufferMessage = [];

    constructor(url) {
        this.socket = new WebSocket(url);
        this.bufferMessage = [];
        this.init()
    }

    static getSocket(url) {
        if (!this.instance) {
            this.instance = new WebSocketService(url)
        }
        return this.instance;
    }

    init() {
        this.socket.onopen = () => {
            this.isConnected = true;
            this.bufferMessage.forEach(message => {
                this.socket.send(message)
            })
            this.bufferMessage = [];
        }

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const { type } = data;
            console.log(data);
            if (this.listners.has(type)) {
                const callback = this.listners.get(type);
                callback(data);
            } else {
                // alert(`not type found:${type}`)
                console.log(`type not added- ${type}`);
                
            }
        }

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            alert("WebSocket error:", error)
        };
    }


    disconnect() {
        if (this.isConnected) {
            this.instance = null;
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }

    sendMessage(message) {
        if (this.isConnected) {
            this.socket.send(message);
        } else {
            this.bufferMessage.push(message);
        }
    }

    addListener(type, callback) {
        if (!this.listners.has(type)) {
            this.listners.set(type, callback)
        }
    }

    removeListener(type) {
        if (this.listners.has(type)) {
            this.listners.delete(type)
        }
    }
}

export default WebSocketService