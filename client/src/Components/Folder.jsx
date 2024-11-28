import React, { useEffect, useState,useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getFolder, updateFolder, toggleOpenFolder, getContent,changeActiveFile } from "../Store/folderSlice.js"
import { AiOutlineFolderAdd, AiOutlineFileAdd, AiOutlineFolder, AiOutlineFile } from "react-icons/ai";
import { IoIosArrowDown,IoIosArrowForward } from "react-icons/io";
import { useParams } from 'react-router-dom';
import WebSocketService from '../utils/WebSocketService.js';
import "./folder.css"
const Folder = ({ folder }) => {
    console.log(folder);
    const dispatch = useDispatch();
    const { openFolders,file_content,activeFile } = useSelector(state => state.folder)
    const { projectName } = useParams();
    const socket = useMemo(() => {
        return WebSocketService.getSocket(`ws://${projectName}.8000.localhost:80?replId=${projectName}`)
    }, [])
    const isOpen = openFolders.has(folder.path);
    const [createFile, setCreateFile] = useState({ type:"", create: false });
    const [name, setName] = useState("")
    const handleClick = () => {
        dispatch(toggleOpenFolder(folder.path));

        if (!isOpen && folder.children === undefined && socket) {
            socket.sendMessage(JSON.stringify({ type: 'get-folder', currentDir: folder.path }));
        }
    };

    const handleFileClick = (file) => {
        let present = false;
        let file_data = {}
        present = file_content.forEach((f) => {
            if(f.path === file.path){
                file_data = f
                return true;
            }
        });
        if(!present){
            console.log(file.name," not present");
            socket.sendMessage(JSON.stringify({ type: 'get-content', path:file.path }))
        }else{
            dispatch(changeActiveFile(f))
        }
    }

    const handleCreateFile = (e, path) => {
        e.preventDefault();
        if(name.length > 0){
            socket.sendMessage(JSON.stringify({ type: "create-file", name, path, ftype: createFile.type }));
            if(!isOpen){
                dispatch(toggleOpenFolder(path));
            }
        }
        setName("")
        setCreateFile((pre) => ({ type: "", create: false }))
    }

    return (
        <div className="folderContainer">
            <div onClick={handleClick}>
                <div className='folderName'>
                    <div className='folderArrow'>
                        {isOpen ? <IoIosArrowDown/> : <IoIosArrowForward/>}
                    </div>
                    <p>{folder.name}</p>
                    <div className="folderButtons">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCreateFile((pre) => ({ type: "dir", create: !createFile.create }));
                            }}
                        >
                            <AiOutlineFolderAdd />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCreateFile((pre) => ({ type: "file", create: !createFile.create }));
                            }}
                        >
                            <AiOutlineFileAdd />
                        </button>
                    </div>
                </div>
                {createFile.create && (
                    <form className="createFileForm" onSubmit={(e) => handleCreateFile(e, folder.path)}>
                        {createFile.type === 'file' ? <AiOutlineFile /> : <AiOutlineFolder />}
                        <input
                            className="createFileInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`Enter ${createFile.type === "dir" ? "folder" : "file"} name`}
                        />
                    </form>
                )}
            </div>

            {isOpen && folder.children && (
                <div className="folderChildren">
                    {folder.children.map((child) => {
                        if (child.type === 'file') {
                            return (
                                <div key={child.path} className={activeFile?.name === child.name ? "activefile file" : "file"} onClick={() => handleFileClick(child)}>
                                    {child.name}
                                </div>
                            );
                        }
                        return <Folder key={child.path} folder={child} />;
                    })}
                </div>
            )}
        </div>


    )
}


const FolderStructure = () => {
    const dispatch = useDispatch();
    const { folder } = useSelector(state => state.folder);
    const { projectName } = useParams();
    const socket = useMemo(() => {
        return WebSocketService.getSocket(`ws://${projectName}.8000.localhost:80?replId=${projectName}`)
    }, [])
    useEffect(() => {
        if (socket) {
            const handleFiles = (data) => dispatch(getFolder({files:data.files,projectName}));
            const handleChildFolder = (data) => dispatch(updateFolder(data));
            const handleFileContent = (data) => { console.log(data), dispatch(getContent(data)) }
            const handleFolerChange = (data) => {
                const {path} = data
                console.log(path);
                socket.sendMessage(JSON.stringify({ type:'get-folder', currentDir: path }));
            }
            socket.addListener('files', handleFiles);
            socket.addListener('child-folder', handleChildFolder);
            socket.addListener('file-content', handleFileContent);
            socket.addListener("refetch-folder", handleFolerChange);
            socket.sendMessage(JSON.stringify({ type: 'init-folder' }));
        }

        return () => {
            if (socket) {
                socket.removeListener('files');
                socket.removeListener('child-folder');
                socket.removeListener('file-content');
            }
        };
    }, [socket]);

    return (
        <div className='mainFolderContainer'>
            <Folder folder={folder} />
        </div>
    )
}

export default FolderStructure