import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    open: false,
    info: null,
}

const displaySlice = createSlice({
    name: "display",
    initialState,
    reducers: {
        setOpen(state, { payload }) {
            console.log("PAYLO", payload)
            state.open = payload
        },
        setInfo(state, { payload }) {
            state.info = payload
        },
    }
})

export const {
    setInfo,
    setOpen
} = displaySlice.actions

export default displaySlice.reducer