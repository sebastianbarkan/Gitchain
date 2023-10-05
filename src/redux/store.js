import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice"
import githubReducer from "./slices/GithubSlice"
import userReducer from "./slices/UserSlice"
import taskReducer from "./slices/TaskSlice"
import pollingReducer from "./slices/PollingSlice";
import displayReducer from "./slices/DisplaySlice";
import conversionReducer from "./slices/ConversionSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        github: githubReducer,
        user: userReducer,
        task: taskReducer,
        polling: pollingReducer,
        display: displayReducer,
        conversion: conversionReducer,
    }
})