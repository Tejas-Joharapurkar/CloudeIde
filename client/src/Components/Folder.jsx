import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getFolder, updateFolder, toggleOpenFolder, getContent } from "../Store/folderSlice.js"
import { AiOutlineFolderAdd,AiOutlineFileAdd,AiOutlineFolder,AiOutlineFile } from "react-icons/ai";
import "./folder.css"
const Folder = ({ folder }) => {
    console.log(folder);
    const dispatch = useDispatch();
    const { openFolders } = useSelector(state => state.folder)
    const { socket } = useSelector(state => state.container)
    const isOpen = openFolders.has(folder.path);
    const [createFile, setCreateFile] = useState({ type: "", create: false });
    const [name, setName] = useState("")
    const handleClick = () => {
        dispatch(toggleOpenFolder(folder.path));

        if (!isOpen && folder.children === undefined && socket) {
            socket.sendMessage(JSON.stringify({ type: 'get-folder', currentDir: folder.path }));
        }
    };

    const handleFileClick = (path) => {
        socket.sendMessage(JSON.stringify({ type: 'get-content', path }))
    }

    const handleCreateFile = (e, path) => {
        e.preventDefault();
        socket.sendMessage(JSON.stringify({ type: "create-file", name, path, ftype: createFile.type }));
        setName("")
        setCreateFile((pre) => ({ type: "", create: false }))
    }

    return (
        <div className="folderContainer">
            <div onClick={handleClick}>
                <div className='folderName'>
                    {/* <div>📁</div> */}
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
                        {createFile.type === 'file' ? <AiOutlineFile /> : <AiOutlineFolder/>}
                        <input
                            className="createFileInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                                <div key={child.path} className="file" onClick={() => handleFileClick(child.path)}>
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
    const { socket } = useSelector(state => state.container);
    useEffect(() => {
        if (socket) {
            const handleFiles = (data) => dispatch(getFolder(data.files));
            const handleChildFolder = (data) => dispatch(updateFolder(data));
            const handleFileContent = (data) => {console.log(data),dispatch(getContent(data))}
            socket.addListener('files', handleFiles);
            socket.addListener('child-folder', handleChildFolder);
            socket.addListener('file-content', handleFileContent);
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