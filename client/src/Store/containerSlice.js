import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import WebSocketService from "../utils/WebSocketService.js"

export const genrateCodingEnv = createAsyncThunk(
    'container/genrateCodingEnv',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8000/container', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const stopCodingEnv = createAsyncThunk(
    'container/stopCodingEnv',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8000/stop', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const containerSlice = createSlice({
    name: 'container',
    initialState: {
        containerName: "",
        containerId: "",
        loading: false,
    },
    reducers: {
        stopContainer: (state, action) => {
            state.containerId = "";
            state.containerName = "",
            state.loading = false;
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
            })
            .addCase(genrateCodingEnv.rejected, (state, action) => {
                state.loading = false;
                console.log("error in genrateCodingEnv.rejected", action.error.message);
            });
    },
})

export const { stopContainer } = containerSlice.actions;
export default containerSlice.reducer;