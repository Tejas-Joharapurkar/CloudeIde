import React, { useEffect, useRef,useMemo } from 'react';
import { useParams } from 'react-router-dom';
import WebSocketService from '../utils/WebSocketService';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';

const Terminal = () => {
    const { projectName } = useParams();
    const terminalRef = useRef(null); 
    const xtermRef = useRef(null); 

    const socket = useMemo(() => {
        return WebSocketService.getSocket(`ws://${projectName}.8000.localhost:80?replId=${projectName}`);
    }, []);

    useEffect(() => {
        xtermRef.current = new XTerm({
            theme: {
                background: '#242424',
                foreground: '#ffffff',
            },
            cursorBlink: true,
            cols:70
        });
        if (terminalRef.current) {
            xtermRef.current.open(terminalRef.current);
            xtermRef.current.write('Connecting to terminal...\r\n');
        }
        if (socket) {
            socket.sendMessage(JSON.stringify({ type: 'get-terminal', terminalId: 1 }));
            const handleTerminalOutput = (data) => {
                xtermRef.current.write(data.data);
            };
            socket.addListener('terminal-output', handleTerminalOutput);
            xtermRef.current.onData((input) => {
                socket.sendMessage(
                    JSON.stringify({ type: 'terminal-input', comd: input, terminalId: 1 })
                );
            });

            return () => {
                socket.removeListener('terminal-output');
                xtermRef.current.dispose();
            };
        }
    }, [socket]);

    return (
        <div
            style={{
                width: '100%',
                height: 'calc(50% - 30px)',
                backgroundColor: '#242424',
                borderRadius: '5px',
                border: '1px solid grey',
                overflow: 'auto',
                outline:"2px solid red"
            }}
        >
            <div ref={terminalRef}  />
        </div>
    );
};

export default Terminal;
