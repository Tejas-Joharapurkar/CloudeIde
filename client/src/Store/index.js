import {configureStore} from "@reduxjs/toolkit"
import containerReducer from "./containerSlice.js"
import folderReducer from"./folderSlice.js"
const store = configureStore({
    reducer:{
        container:containerReducer,
        folder:folderReducer
    },
})

export default store