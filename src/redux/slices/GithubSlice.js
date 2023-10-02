import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    contributions: null,
    languages: null
}

export const fetchUserData = createAsyncThunk("github/fetchUserData", async () => {
    try {
        const response = await axios.get('http://localhost:3001/user-data', { withCredentials: true });
        console.log(response.data); 
    } catch (error) {
        console.error('Failed to fetch user data', error);
    }
})

const githubSlice = createSlice({
    name: "github",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder

    }
})


export const {

} = githubSlice.actions

export default githubSlice.reducer