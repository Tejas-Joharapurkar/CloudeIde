import {createSlice} from "@reduxjs/toolkit"

const folderSlice = createSlice({
    name:'folder',
    initialState:{
        folder:{},
        openFolders: new Set(),
        file_content:[],
        activeFile:null
    },
    reducers:{
        getFolder:(state,action)=>{
            state.folder = {type:'dir',path:`/workspace/${action.payload.projectName}`,name:action.payload.projectName,children:action.payload.files};
        },

        updateFolder:(state,action)=>{
            const {currentDir,files} = action.payload;
            let path = currentDir.split('/');
            const updateFolder = (folder,index) =>{
                if(path[path.length - 1] === folder.name){
                    folder.children = files
                    return folder
                }
                folder.children.map((file)=>{
                    if(file.name === path[index]){
                        return updateFolder(file,index+1);
                    }
                    return file;
                })
                return folder;
            }
            const newFolder = updateFolder(state.folder,3);
            state.folder = newFolder
            console.log(currentDir);
            console.log(files);
        },

        toggleOpenFolder: (state, action) => {
            const folderPath = action.payload;
            if (state.openFolders.has(folderPath)) {
                state.openFolders.delete(folderPath);
            } else {
                state.openFolders.add(folderPath);
            }
        },

        getContent: (state, action) => {
            const { name, path, content, status } = action.payload;
            const present = state.file_content.find(file => file.name === name && file.path === path);
            if (!present) {
                state.file_content = [...state.file_content, { name, path, content, status }];
            }
            state.activeFile = { name, path, content };
        },

        removeContent:(state,action)=>{
            const name = action.payload
            console.log(`file removed called ${name}`);
            state.file_content = state.file_content.filter((file)=>file.name !== name);
            if(state.activeFile.name === name){
                if(state.file_content.length > 0){
                    state.activeFile = state.file_content[0];
                }else{
                    state.activeFile = null
                }
            }
        },
        changeActiveFile:(state,action)=>{
            const data = action.payload
            console.log(data);
            state.activeFile = data
        },
        updateFileStatus: (state, action) => {
            const { name, status,content } = action.payload;
            state.file_content = state.file_content.map((file)=>{
                if(file.name === name){
                    return {...file,status,content}
                }
                return file
            })
        }
    }
})

export const {getFolder,updateFolder,toggleOpenFolder,getContent,removeContent,changeActiveFile,updateFileStatus} = folderSlice.actions;
export default folderSlice.reducer;