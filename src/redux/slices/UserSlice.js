import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tronWeb from "../../tron/tronWeb.js"

const initialState = {
	trustLevel: 0,
	contributions: null,
	age: null,
	earned: null,
	address: null,
	status: 'idle',
	created: null,
	signed: null,
	error: null,
	fetchState: "idle"
}

function calculateTrustLevel(currentTrustLevel, verifications, contributionCount) {
    // Define the increments for each verification and contribution
    const VERIFICATION_INCREMENT = 0.1;
    const CONTRIBUTION_INCREMENT = 0.2;

    // If verifications or contributionCount are 0, treat them as neutral (i.e., no effect)
    let verificationEffect = verifications > 0 ? verifications * VERIFICATION_INCREMENT : 0;
    let contributionEffect = contributionCount > 0 ? contributionCount * CONTRIBUTION_INCREMENT : 0;

    // Calculate new trust level
    let newTrustLevel = currentTrustLevel + verificationEffect + contributionEffect;

    return newTrustLevel;
}


const userContractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "addEarned",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUserTrustData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "trustLevel",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "taskLevel",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "commitHash",
								"type": "string"
							}
						],
						"internalType": "struct Trust.Contribution[]",
						"name": "contributions",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256[]",
						"name": "signed",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256[]",
						"name": "created",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "age",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "earned",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					}
				],
				"internalType": "struct Trust.UserTrust",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_newStatus",
				"type": "string"
			}
		],
		"name": "setStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_trustLevel",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "taskLevel",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "commitHash",
						"type": "string"
					}
				],
				"internalType": "struct Trust.Contribution[]",
				"name": "_contributions",
				"type": "tuple[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_signedIds",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_createdIds",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "_age",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_earned",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "setUserTrustData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userTrustData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "trustLevel",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "earned",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
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


export const setUserTrustData = createAsyncThunk(
	'user/setUserTrustData',
	async ({ initial, address }, { getState, dispatch }) => {

		const contributions = getState().user.contributions
		const status = getState().user.status
		const created = getState().user.created
		const signed = getState().user.signed
		const earned = getState().user.earned
		const age = getState().user.age
		const trustLevel = getState().user.trustLevel
		const userAddress = address || getState().user.address

		try {
			const contract = tronWeb.contract(userContractABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_USER);
			let contributionsData = [];
			let signedData = []
			let createdData = []
			let transactionHash;  // Variable to store the transaction hash

			
			if (initial) {
				const userAddressInitial = address;
				const trustLevelInitial = 1;
				const ageInitial = Date.now();
				const earnedInitial = 0;
				const statusInitial = "idle"

				transactionHash = await contract.setUserTrustData(
					userAddressInitial,
					trustLevelInitial,
					contributionsData,
					signedData,
					createdData,
					ageInitial,
					earnedInitial,
					statusInitial
				).send();

			} else {
				contributionsData = contributions.map(contribution => ({
					taskLevel: contribution.taskLevel,
					commitHash: tronWeb.toHex(contribution.commitHash)
				}));

				if (signed) {
					signedData = [...signed];
				} 
				
				if (created) {
					createdData = [...created];
				}
				
				const newTrustLevel = calculateTrustLevel({trustLevel, verifications: signedData.length, contributionCount: contributionsData.length })

				transactionHash = await contract.setUserTrustData(
					userAddress,
					newTrustLevel,
					contributionsData,
					signedData,
					createdData,
					age,
					earned,
					status
				).send();
			}

			// Use the transactionHash to check the status until it's confirmed
			let transactionReceipt = await tronWeb.trx.getTransactionInfo(transactionHash);
			const startTime = Date.now();
			const FIVE_MINUTES = 5 * 60 * 1000;  // 5 minutes in milliseconds

			while (!transactionReceipt.contractResult && Date.now() - startTime < FIVE_MINUTES) {
				await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds
				transactionReceipt = await tronWeb.trx.getTransactionInfo(transactionHash);
			}

			if (!transactionReceipt.contractResult) {
				throw new Error('Transaction confirmation timed out after 5 minutes');
			}
			// Once confirmed, return the transaction receipt. This will be available in the fulfilled action payload.
			if (transactionReceipt.receipt.result === "SUCCESS") {
				return { status: 'confirmed', transactionReceipt };
			} else {
				return { status: 'rejected', transactionReceipt };
			}


		} catch (err) {
			console.log("set error", err);

			// Throw the error so that it will be automatically caught and the rejected action will be dispatched
			throw err;
		}
	}
);


export const getUsersTrustData = createAsyncThunk(
	'user/getUsersTrustData',
	async (userAddress, thunkAPI) => {
		try {
			const contract = tronWeb.contract(userContractABI, import.meta.env.VITE_APP_CONTRACT_ADDRESS_USER);
			const response = await contract.getUserTrustData(userAddress).call();

			if (!response) {
				throw new Error('No response from contract.');
			}
			const formattedResponse = {
				trustLevel: response.trustLevel.toNumber(), 
				contributions: response.contributions,
				age: response.age.toNumber(),
				earned: response.earned.toNumber(),
				signed: response.signed,
				status: response.status,
				created: response.created
			}

			return formattedResponse;
		} catch (error) {
			console.error("Error fetching user trust data:", error);
			return thunkAPI.rejectWithValue(error.toString());
		}
	}
);

export const establishUser = createAsyncThunk("user/establishUser", async (args, { getState, dispatch }) => {
	const address = args
	try {
		await dispatch(getUsersTrustData(address))
		if (getState().user.age === 0) {
			await dispatch(setUserTrustData({ initial: true, data: null, address: address }))
		}
	} catch (err) {
		console.log("ESTABLISH", err)
		return err
	}
})

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setContributions(state, {payload}){
			state.contributions.push({taskLevel: 1, commitHash: "testHash"})
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(setUserTrustData.pending, (state) => {
				state.setDataStatus = 'loading';
			})
			.addCase(setUserTrustData.fulfilled, (state) => {
				state.setDataStatus = 'succeeded';
			})
			.addCase(setUserTrustData.rejected, (state, action) => {
				state.setDataStatus = 'failed';
				state.error = action.error.message;
			})
			.addCase(getUsersTrustData.pending, (state) => {
				state.getDataStatus = 'loading';
			})
			.addCase(getUsersTrustData.fulfilled, (state, { payload }) => {
				state.getDataStatus = 'succeeded';
				state.earned = payload.earned
				state.contributions = payload.contributions
				state.age = payload.age
				state.trustLevel = payload.trustLevel
				state.status = payload.status
				state.created = payload.created
				state.signed = payload.signed
			})
			.addCase(getUsersTrustData.rejected, (state, action) => {
				state.getDataStatus = 'failed';
				state.error = action.error.message;
			});
	}
});

export default userSlice.reducer;
