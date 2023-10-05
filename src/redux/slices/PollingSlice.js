import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

async function checkTransactionStatus(transactionInfo, tronWeb) {
    console.log("CHECK", transactionInfo, tronWeb)
    try {
        const receipt = await tronWeb.trx.getConfirmedTransaction(transactionInfo);
        console.log("RECEIPT", receipt, receipt.ret)
        if (receipt) {
            return 'confirmed';
        } else {
            return 'pending';
        }
    } catch (err) {
        return 'error';
    }
}
export async function pollTransaction(transactionInfo, tronWeb) {
    console.log("POLL TX", transactionInfo, tronWeb)
    let status = await checkTransactionStatus(transactionInfo, tronWeb);
    console.log("poll STATUS", status)
    while (status === 'pending') {
        status = await checkTransactionStatus(transactionInfo, tronWeb);
        if (status === 'confirmed') {
            toast.success(`Transaction ${transactionInfo} confirmed!`);
        } else if (status === 'error') {
            toast.error(`Error checking transaction ${transactionInfo}. Retrying in 10 seconds...`);
        }
        if (status !== 'confirmed') {
            await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
        }
    }
    return status;
}


export const startTransactionPolling = createAsyncThunk("polling/startTransactionPolling", async (args, {getState, dispatch}) => {
  
    const { transactionInfo, tronWeb } = args
    try {
        const status = await pollTransaction(transactionInfo, tronWeb);
        dispatch(setTransactionStatus({ transactionInfo, status }));
    } catch (error) {
        console.error("Error in startTransactionPolling:", error);
    }
})



const initialState = JSON.parse(localStorage.getItem('transactions')) || {};

const pollingSlice = createSlice({
    name: 'polling',
    initialState,
    reducers: {
        setTransactionStatus: (state, action) => {

            const { transactionInfo, status } = action.payload;
            console.log("PAYLOAD", transactionInfo, status)
            state[transactionInfo] = status;
            localStorage.setItem('transactions', JSON.stringify(state));
        }
    }
});

export const { setTransactionStatus } = pollingSlice.actions;
export default pollingSlice.reducer;