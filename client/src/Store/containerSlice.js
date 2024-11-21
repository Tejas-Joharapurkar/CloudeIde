import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import WebSocketService from "../utils/WebSocketService.js"

export const genrateCodingEnv = createAsyncThunk('container/genrateCodingEnv', async (data) => {
    const response = await axios.post('http://localhost:8000/container', data)
    return response.data
})
export const stopCodingEnv = createAsyncThunk('container/stopCodingEnv', async (data) => {
    const response = await axios.post('http://localhost:8000/stop', data)
    alert(response.data)
    return response.data
})

const containerSlice = createSlice({
    name: 'container',
    initialState: {
        containerName: "",
        containerId: "",
        loading: false,
        socket:null,
    },
    reducers: {
        createContainer: (state, action) => {
            const { name, id } = action.payload;
            state.containerName = name;
            state.containerId = id;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(genrateCodingEnv.pending, (state) => {
                state.loading = true;
            })
            .addCase(genrateCodingEnv.fulfilled, (state, action) => {
                state.loading = false;
                const { name, id } = action.payload;
                state.containerName = name;
                state.containerId = id;
                state.socket = WebSocketService.getSocket(`ws://${name}.8000.localhost:80?replId=childProject`);
            })
            .addCase(genrateCodingEnv.rejected, (state, action) => {
                state.loading = false;
                console.log("error in genrateCodingEnv.rejected",action.error.message);
            });
    },
})

export const {createContainer} = containerSlice.actions;
export default containerSlice.reducer;