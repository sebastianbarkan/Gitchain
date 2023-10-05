import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// CoinGecko API endpoint for TRX to USD conversion
const API_ENDPOINT = 'https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd';

export const fetchConvertedValue = createAsyncThunk(
  'conversion/fetchConvertedValue',
  async (trxValue) => {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    return trxValue * data.tron.usd;
  }
);

const conversionSlice = createSlice({
  name: 'conversion',
  initialState: {
    convertedValue: 0,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConvertedValue.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConvertedValue.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.convertedValue = action.payload;
      })
      .addCase(fetchConvertedValue.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default conversionSlice.reducer;
