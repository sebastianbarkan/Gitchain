import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    authenticated: false,
    address: null
}
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
    console.log("HERE")
    try {
        fetch("http://localhost:3001/session-data", {
            method: "GET",
        })
        .then(res => {
            console.log("RESPONSE", res)
        })
    } catch(err) {
        console.log("ERROR", err)
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    }
})

export const {

} = authSlice.actions

export default authSlice.reducer
