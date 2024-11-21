import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux"

const Terminal = () => {
    const { socket } = useSelector(state => state.container);
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    useEffect(() => {
        if (socket) {
            socket.sendMessage(JSON.stringify({ type: 'get-terminal', terminalId: 1 }))
            const handleTerminalOutput = (data) => {
                setOutput((prev) => prev + data.data);
            }
            const handleFolerChange = () => {
                alert("folder changed/created")
            }

            socket.addListener("terminal-output", handleTerminalOutput);
            socket.addListener("refetch-folder", handleFolerChange);
        }
        return () => {
            if (socket) {
                socket.removeListener("terminal-output");
                socket.removeListener("refetch-folder");
            }
        };
    }, [socket]);

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return;
        if (socket) {
            socket.sendMessage(JSON.stringify({ type: "terminal-input", comd: input + '\n', terminalId: 1 }));
            setInput("");
        }
    };

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div
            style={{
                // width: "calc(100% - 20px)",
                height: "50%",
                overflow: "auto",
                background: "black",
                outline: "1px solid grey",
                color: "white",
                padding: "10px",
            }}
            onClick={focusInput}
        >
            <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
            <input
                type="text"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    width: "80%",
                    color: "white",
                    background: "black",
                    border: "none",
                    outline: "none",
                    fontSize: "15px",
                    letterSpacing: "1.5px"
                }}
            />
        </div>
    );
};

export default Terminal;
