import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice"
import githubReducer from "./slices/GithubSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        github: githubReducer
    }
})