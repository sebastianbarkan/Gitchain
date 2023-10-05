import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { establishUser } from "./UserSlice";

const initialState = {
    authenticated: false,
    address: null,
    loading: true
}

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { dispatch}) => {

    try {
        const response = await fetch("http://localhost:3001/session-data", {
            method: "GET",
            credentials: 'include',
        }); 

        if (response.status === 200) {
            const data = await response.json()
            const address = data.address
            await dispatch(establishUser(address))
            return { status: response.status, data }
        } else {
            return { status: response.status, data: null }
        }

        
        
    } catch (err) {
        console.error("ERROR", err.status);  // Changed console.log to console.error
        return err;  // This will be the payload in the rejected action
    }
});

export const setAuth = createAsyncThunk("auth/setAuth", async (args) => {
    const address = args.address;
    console.log("chekc ad", address)
    try {
        const response = await fetch("http://localhost:3001/auth", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',  // Corrected from contentType to headers
            },
            body: JSON.stringify({
                address: address
            })
        });

        if (response.status === 200) {
            return address;
        } else {
            const error = new Error('Failed to authenticate');
            error.response = response;
            return response.status;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated(state, { payload }) {
            state.authenticated = payload
        },
        setIsLoading(state, { payload }) {
            state.loading = payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.fulfilled, (state, { payload }) => {
  
                if (payload.status !== 200) {
                    state.authenticated = false;
                    state.loading = false;
                } else {
                    state.authenticated = true;
                    state.loading = false;
                    state.address = payload.data.address
                }

            })
            .addCase(checkAuth.rejected, (state, { payload }) => {
                state.authenticated = false;
                state.loading = false;
            })
            .addCase(setAuth.fulfilled, (state, { payload }) => {
                state.address = payload
                state.authenticated = true
            })
    }
})

export const {
    setAuthenticated
} = authSlice.actions

export default authSlice.reducer
