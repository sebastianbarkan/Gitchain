import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice"
import githubReducer from "./slices/GithubSlice"
import userReducer from "./slices/UserSlice"
import taskReducer from "./slices/TaskSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        github: githubReducer,
        user: userReducer,
        task: taskReducer
    }
})