import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import tronWeb from "../../tron/tronWeb";
import axios from "axios"

const initialState = {
	trustLevel: null,
	bounty: null,
	taskId: null,
	address: null,
	signerLevel: null,
	status: null,
	timeToComplete: null,
	subject: null,
	languages: null,
	description: null,
	githubRepo: null,
	allTasks: null,
	taskFilter: "",
}

const ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_taskId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_signerLevel",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_verdict",
				"type": "string"
			}
		],
		"name": "completeTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_taskId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_taskLevel",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_signerLevel",
				"type": "uint256"
			}
		],
		"name": "createTask",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_taskId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_userLevel",
				"type": "uint256"
			}
		],
		"name": "initializeSubmission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_taskId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_githubCommit",
				"type": "string"
			}
		],
		"name": "submitTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "tasks",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "submitter",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "taskLevel",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "signerLevel",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bounty",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "githubCommit",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
export const createTask = createAsyncThunk(
	'task/createTask',
	async ({ taskLevel, signerLevel, bountyAmount, description, languages, category, githubRepo }, { getState, dispatch }) => {
		const taskId = uuidv4();
	
		try {
			const contract = tronWeb.contract(ABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_TASK);

			const transactionInfo = await contract.createTask(taskId, taskLevel, signerLevel).send({
				callValue: bountyAmount,
			});

			if (!transactionInfo) {
				throw new Error('No response from contract.');
			}

			// Polling mechanism to wait for transaction confirmation
			let transactionReceipt = null;
			const maxAttempts = 100;
			let attempts = 0;
			while (attempts < maxAttempts) {
				attempts++;
				try {
					transactionReceipt = await tronWeb.trx.getConfirmedTransaction(transactionInfo);

					if (transactionReceipt && transactionReceipt.ret && transactionReceipt.ret[0].contractRet === 'SUCCESS') {
						break; // break out of the loop if the transaction is found and is successful
					}
				} catch (err) {
					console.log("Transaction not yet confirmed, retrying in 10 seconds..."); // Log the retry attempt
				}
				await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 seconds before polling again
			}

			if (!transactionReceipt || !transactionReceipt.ret || transactionReceipt.ret[0].contractRet !== 'SUCCESS') {
				throw new Error('Transaction was not confirmed in time or failed.');
			}


			if (transactionReceipt.ret[0].contractRet !== 'SUCCESS') {
				throw new Error('Transaction failed.');
			}

			const taskData = await contract.tasks(taskId).call();
			if (taskData) {
				await dispatch(saveTaskInfo({ taskId, category, description, languages, githubRepo, amount: bountyAmount }));
			} else {
				throw new Error('TaskID mismatch or task not found.');
			}

			return transactionInfo;
		} catch (error) {
			console.error("Error creating task:", error);
			return thunkAPI.rejectWithValue(error.toString());
		}
	}
);


export const initializeSubmission = createAsyncThunk(
	'task/initializeSubmission',
	async ({ taskId, userLevel }, { getState, dispatch }) => {
		console.log("arggg", taskId, userLevel)
		try {
			const contract = tronWeb.contract(ABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_TASK);

			const transactionInfo = await contract.initializeSubmission(taskId, userLevel).send();
			console.log("TRX INFO", transactionInfo)
			if (!transactionInfo) {
				throw new Error('No response from contract.');
			}

			// Polling mechanism to wait for transaction confirmation
			let transactionReceipt = null;
			const maxAttempts = 100;
			let attempts = 0;
			while (attempts < maxAttempts) {
				attempts++;
				try {
					transactionReceipt = await tronWeb.trx.getConfirmedTransaction(transactionInfo);

					if (transactionReceipt && transactionReceipt.ret && transactionReceipt.ret[0].contractRet === 'SUCCESS') {
						break; // break out of the loop if the transaction is found and is successful
					}
				} catch (err) {
					console.log("Transaction not yet confirmed, retrying in 10 seconds..."); // Log the retry attempt
				}
				await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 seconds before polling again
			}

			if (!transactionReceipt || !transactionReceipt.ret || transactionReceipt.ret[0].contractRet !== 'SUCCESS') {
				throw new Error('Transaction was not confirmed in time or failed.');
			}

			const taskData = await contract.tasks(taskId).call();
			console.log("CHECK SUBMISSION", taskData.submitter, tronWeb.defaultAddress.base58.toLowerCase())
			if (!taskData || taskData.submitter.toLowerCase() !== tronWeb.defaultAddress.base58.toLowerCase()) {
				throw new Error('Initialization was not successful or submitter does not match.');
			}

			return transactionInfo;
		} catch (error) {
			console.error("Error initializing submission:", error);
			return thunkAPI.rejectWithValue(error.toString());
		}
	}
);

export const submitUserTask = createAsyncThunk(
    'task/submitUserTask',
    async ({ taskId, githubCommit }, { getState, dispatch }) => {
        console.log("Submitting for task ID:", taskId, "with commit:", githubCommit);

        try {
            const contract = tronWeb.contract(ABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_TASK);

            // Call the submitTask function in the contract
            const transactionInfo = await contract.submitTask(taskId, githubCommit).send();
            console.log("TRX INFO", transactionInfo);

            if (!transactionInfo) {
                throw new Error('No response from contract.');
            }

            // Polling mechanism to wait for transaction confirmation
            let transactionReceipt = null;
            const maxAttempts = 100;
            let attempts = 0;
            while (attempts < maxAttempts) {
                attempts++;
                try {
                    transactionReceipt = await tronWeb.trx.getConfirmedTransaction(transactionInfo);

                    if (transactionReceipt && transactionReceipt.ret && transactionReceipt.ret[0].contractRet === 'SUCCESS') {
                        break; // break out of the loop if the transaction is found and is successful
                    }
                } catch (err) {
                    console.log("Transaction not yet confirmed, retrying in 10 seconds..."); // Log the retry attempt
                }
                await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 seconds before polling again
            }

            if (!transactionReceipt || !transactionReceipt.ret || transactionReceipt.ret[0].contractRet !== 'SUCCESS') {
                throw new Error('Transaction was not confirmed in time or failed.');
            }

            const taskData = await contract.tasks(taskId).call();

            if (!taskData || taskData.githubCommit !== githubCommit) {
                throw new Error('Submission was not successful or the github commit does not match.');
            }

            return transactionInfo;
        } catch (error) {
            console.error("Error submitting the task:", error);
            throw error;  // Throwing error will automatically be caught as a rejected action by the createAsyncThunk
        }
    }
);

export const fetchSubmitterAddress = createAsyncThunk(
    'task/fetchSubmitterAddress',
    async (taskId, { rejectWithValue }) => {
        try {
            const contract = tronWeb.contract(ABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_TASK);

			console.log("TASK ID", taskId)
            // Fetch task data by taskId
            const taskData = await contract.tasks(taskId.taskId).call();

			console.log("submitter", taskData)
            // Extract and return the submitter address from the task data
            return taskData.submitter;

        } catch (error) {
            console.error("Error fetching submitter address:", error);
            return rejectWithValue(error.toString());
        }
    }
);

export const completeUserTask = createAsyncThunk(
    'task/completeUserTask',
    async ({ taskId, signerLevel, verdict }, { getState, dispatch }) => {
        console.log("Completing task ID:", taskId, "with signerLevel:", signerLevel, "and verdict:", verdict);

        try {
            const contract = tronWeb.contract(ABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_TASK);

            // Call the completeTask function in the contract
            const transactionInfo = await contract.completeTask(taskId, signerLevel, verdict).send();
            console.log("TRX INFO", transactionInfo);

            if (!transactionInfo) {
                throw new Error('No response from contract.');
            }

            // Polling mechanism to wait for transaction confirmation
            let transactionReceipt = null;
            const maxAttempts = 100;
            let attempts = 0;
            while (attempts < maxAttempts) {
                attempts++;
                try {
                    transactionReceipt = await tronWeb.trx.getConfirmedTransaction(transactionInfo);

                    if (transactionReceipt && transactionReceipt.ret && transactionReceipt.ret[0].contractRet === 'SUCCESS') {
                        break; // break out of the loop if the transaction is found and is successful
                    }
                } catch (err) {
                    console.log("Transaction not yet confirmed, retrying in 10 seconds..."); // Log the retry attempt
                }
                await new Promise(resolve => setTimeout(resolve, 10000)); // wait for 10 seconds before polling again
            }

            if (!transactionReceipt || !transactionReceipt.ret || transactionReceipt.ret[0].contractRet !== 'SUCCESS') {
                throw new Error('Transaction was not confirmed in time or failed.');
            }

            const taskData = await contract.tasks(taskId).call();

            if (!taskData || taskData.status !== verdict) { // modify this condition based on your needs
                throw new Error('Completion was not successful or the status does not match.');
            }

            return transactionInfo;
        } catch (error) {
            console.error("Error completing the task:", error);
            throw error;  // Throwing error will automatically be caught as a rejected action by the createAsyncThunk
        }
    }
);

export const fetchTaskStatus = createAsyncThunk(
    'task/fetchTaskStatus',
    async ({ taskId }, { getState, dispatch }) => {
        try {
            // Instantiate the contract
            const contract = tronWeb.contract(ABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_TASK);

            // Fetch the task data
            const taskData = await contract.tasks(taskId).call();
            if (!taskData) {
                throw new Error('No task found with the provided ID.');
            }

            // Return the status of the taskcon
            return taskData.status;

        } catch (error) {
            console.error("Error fetching task status:", error);
            throw error;  // In async thunks, simply throw the error and it will be handled as a rejected action
        }
    }
);


export const saveTaskInfo = createAsyncThunk("task/saveTaskInfo", async (args, { getState, dispatch }) => {
	try {
		// Here's the POST request to your server's endpoint
		const response = await axios.post('http://localhost:3001/create-task', args, {
			withCredentials: true
		});

		// We expect the server to return a confirmation message if successful
		return response.data;
	} catch (error) {
		// If there's an error, we'll handle it by returning the rejected value
		// This allows us to handle this error in the extraReducers later
		return thunkAPI.rejectWithValue(error.response.data);
	}
})

export const fetchTasks = createAsyncThunk("task/fetchTasks", async (_, { rejectWithValue }) => {
	try {
		// Here's the GET request to your server's endpoint
		const response = await axios.get('http://localhost:3001/fetch-tasks', {
			withCredentials: true
		});

		// We expect the server to return an array of tasks if successful
		return response.data;
	} catch (error) {
		// If there's an error, we'll handle it by returning the rejected value
		return rejectWithValue(error.response.data);
	}
});


const taskSlice = createSlice({
	name: "task",
	initialState,
	reducers: {
		setTaskFilter(state, { payload }) {
			state.taskFilter = payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTasks.fulfilled, (state, { payload }) => {
				console.log("FULFILLFED", payload)
				state.allTasks = payload
			})
	}
})

export const {
	setTaskFilter
} = taskSlice.actions

export default taskSlice.reducer