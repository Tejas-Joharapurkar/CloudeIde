import React, { useEffect, useState,useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeContent, changeActiveFile, updateFileStatus } from '../Store/folderSlice';
import { Editor } from '@monaco-editor/react';
import { IoIosClose } from 'react-icons/io';
import { IoCloudDoneOutline, IoCloudOfflineOutline, IoCloudUploadOutline } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import "./editor.css"
import WebSocketService from "../utils/WebSocketService"
const CodeEditor = ({ initialCode = '', language = 'javascript', path, name }) => {
    const [code, setCode] = useState(initialCode);
    const [timeOutId, setTimeOutId] = useState('');
    const dispatch = useDispatch();
    const { projectName } = useParams();
    const socket = useMemo(() => {
        return WebSocketService.getSocket(`ws://${projectName}.8000.localhost:80?replId=${projectName}`)
    }, [projectName])

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);
    
    useEffect(() => {
        const handleFileStatus = (data) => {
            data.name = name
            dispatch(updateFileStatus(data))
        }
        socket.addListener("acknowledge-save-file", handleFileStatus)
        return () => {
            socket.removeListener("acknowledge-save-file")
        }
    }, [])
    const handleEditorChange = (value) => {
        setCode(value);
        if (timeOutId) {
            clearTimeout(timeOutId);
            setTimeOutId('');
        }
        const timeout = setTimeout(() => {
            dispatch(updateFileStatus({ name, status: "saving",content:value }))
            socket.sendMessage(JSON.stringify({ type: 'save-file', path, content: value }));
        }, 2500);
        setTimeOutId(timeout);
    };

    return (
        <div className="editor-container">
            <Editor
                height="100%"
                defaultLanguage={language}
                value={code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    automaticLayout: true,
                    minimap: { enabled: false },
                }}
            />
        </div>
    );
};

const EdittingSpace = () => {
    const { file_content, activeFile } = useSelector((state) => state.folder);
    const dispatch = useDispatch();

    const handleClick = (name) => {
        dispatch(removeContent(name));
    };

    return (
        <div className="editing-space">
            {/* Tabs Container */}
            <div className="tabs-container">
                {file_content.map((file) => (
                    <div
                        onClick={() => dispatch(changeActiveFile(file))}
                        key={file.name}
                        className={`tab ${activeFile?.name === file.name ? 'active' : ''}`}
                    >
                        <p>{file.name}</p>
                        <div className="status-indicator">
                            {file.status === 'not_saved' && <span className="not-saved"><IoCloudOfflineOutline /></span>}
                            {file.status === 'saving' && <span className="saving"><IoCloudUploadOutline /></span>}
                            {file.status === 'saved' && <span className="saved"><IoCloudDoneOutline /></span>}
                        </div>
                        <div
                            className="close-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick(file.name);
                            }}
                        >
                            <IoIosClose />
                        </div>
                    </div>
                ))}
            </div>

            {/* Editor or Placeholder */}
            <div className="editor-wrapper">
                {activeFile ? (
                    <CodeEditor initialCode={activeFile.content} path={activeFile.path} name={activeFile.name} />
                ) : (
                    <div className="placeholder">
                        <h2>Code Editor</h2>
                        <h4>Please Click on a file to open it in Editor</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EdittingSpace;
