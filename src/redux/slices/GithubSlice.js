import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    contributions: null,
    languages: null,
    githubAuth: false
}

export const fetchUserData = createAsyncThunk("github/fetchUserData", async () => {
    try {
        const response = await axios.get('http://localhost:3001/user-data', { withCredentials: true });
        console.log(response.data);
        return response.data
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
            .addCase(fetchUserData.fulfilled, (state, { payload}) => {
                state.contributions = payload.contributions
                let totalLanguageCounts = {};
                let totalBytes = 0;
                
                // Loop through each language amount object and aggregate the language counts
                payload.languageData.forEach(amount => {
                    for (let language in amount) {
                        totalLanguageCounts[language] = (totalLanguageCounts[language] || 0) + amount[language];
                        totalBytes += amount[language];
                    }
                });

                // Prepare the output object
                let languageInfo = {};
                for (let language in totalLanguageCounts) {
                    const percentage = ((totalLanguageCounts[language] / totalBytes) * 100).toFixed(2) + '%';
                    const bytes = totalLanguageCounts[language];
                    languageInfo[language] = { percentage, bytes };
                }

                state.languages = languageInfo
                state.githubAuth = true
            })
    }
})


export const {

} = githubSlice.actions

export default githubSlice.reducer