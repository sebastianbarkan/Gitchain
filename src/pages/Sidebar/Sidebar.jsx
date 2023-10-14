import React, { useEffect, useState } from 'react'
import styles from "./Sidebar.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { setOpen, setInfo } from '../../redux/slices/DisplaySlice';
import { fetchConvertedValue } from '../../redux/slices/ConversionSlice';
import { fetchTaskStatus, initializeSubmission, fetchGithubCommit } from '../../redux/slices/TaskSlice'
import { fetchSubmitterAddress } from '../../redux/slices/TaskSlice';
import { unwrapResult } from '@reduxjs/toolkit';

function Sidebar() {
    const dispatch = useDispatch()
    const open = useSelector(state => state.display.open)
    const info = useSelector(state => state.display.info)
    const [status, setStatus] = useState(null)
    const [verdict, setVerdict] = useState("")
    const address = useSelector(state => state.auth.address)
    const trustLevel = useSelector(state => state.user.trustLevel)
    const API_ENDPOINT = 'https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd';
    const [commit, setCommit] = useState("")
    useEffect(() => {
        const fetchConvertedValue = async (trxValue) => {
            const response = await fetch(API_ENDPOINT);
            const data = await response.json();
            return trxValue * data.tron.usd;

        }
        fetchConvertedValue()
    }, [])

    const toggleSideBar = () => {
        dispatch(setOpen(!open))
    }


    const handleVerdict = (e) => {
        setVerdict(e.target.value)
    }

    const submitVerdict = (e) => {
        e.preventDefault()
        const getSubmitterAddress = async (taskId) => {
            try {
                // Dispatch the action to fetch the submitter address
                const actionResult = await dispatch(fetchSubmitterAddress(taskId));

                // Unwrap the result and get the submitter address
                const submitterAddress = actionResult.payload;
                if (submitterAddress !== tronWeb.defaultAddress.hex) {

                    dispatch(completeUserTask({ taskId: info.taskId, signerLevel: trustLevel, verdict: verdict }))
                }
                // Now you can use submitterAddress in your component's state or wherever you need it
            } catch (error) {
                console.error("Failed to fetch submitter address:", error.message);
            }
        }
        // Call getSubmitterAddress with the taskId
        getSubmitterAddress({ taskId: info.taskId });

    }

    useEffect(() => {
        const getStatus = async () => {
            try {
                // The dispatched action will either result in a fulfilled or rejected action
                const actionResult = await dispatch(fetchTaskStatus({ taskId: info.taskId }));

                // Using unwrapResult will throw an error if the action was rejected
                const fetchedStatus = unwrapResult(actionResult);
                setStatus(fetchedStatus)

            } catch (error) {
                console.error("Failed to fetch task status:", error.message);
            }
        }

        getStatus();
    }, []);

    const [githubCommit, setGithubCommit] = useState("");  // local state to store the fetched githubCommit


    const convertedValue = useSelector(state => state.conversion.convertedValue);

    useEffect(() => {
        const handleConversion = async (trxValue) => {
            try {
                await dispatch(fetchConvertedValue(trxValue)).unwrap();
            } catch (err) {
                console.error("Conversion failed:", err);
            }
        };

        if (info.amount) {
            let value = info.amount
            handleConversion(value)
        }
    }, [])



    const handleClick = () => {
        dispatch(initializeSubmission({ taskId: info.taskId, userLevel: trustLevel }))
    }
    console.log("status", status)

    return (
        <div className={styles["sidebar-underlay"]}>
            <div className={styles["clicky-thing"]}>
            </div>
            <div className={styles.sidebar}>
                <div className={styles["sidebar-body"]}>
                    <h2 className={styles["sidebar-title"]}>{info.amount} TRX</h2>
                    <div className={styles.bentos}>
                        <div className={`${styles.bento} ${styles["basic-bento"]}`} style={{ gridArea: 'basic' }}>
                            <div className={styles["base-details"]}>
                                <p className={styles.stack}>React, CSS/HTML, JavaScript</p>
                                <div className={styles.subject}>
                                    <p className={styles["subject-text"]}>UI</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.bento} ${styles["big-badge"]}`} style={{ gridArea: 'reward' }}>
                            <div className={styles["big-badge-inner"]}>
                                <p className={styles["big-badge-value"]}>${convertedValue.toFixed(0)}</p>
                                <p className={styles["big-badge-name"]}>Reward</p>
                            </div>
                        </div>
                        <div className={`${styles.bento} ${styles["big-badge"]}`} style={{ gridArea: 'level' }}>
                            <div className={styles["big-badge-inner"]}>
                                <p className={styles["big-badge-value"]}>1</p>
                                <p className={styles["big-badge-name"]}>Level</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.description}>
                        <h3>Task description</h3>
                        <p>{info.description}</p>
                    </div>
                    {
                        status === "NEW" ?
                            <div className='btn-wrapper'>
                                <button type="button" className={styles.button} onClick={handleClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7L10 17l-5-5" />
                                    </svg>
                                    <span className={styles.span}>Accept task</span>
                                </button>
                                <button type="button" onClick={toggleSideBar} className={styles["secondary-button"]}>
                                    <span>Cancel task</span>
                                </button>
                            </div>
                            :
                            status === "IN PROGRESS" ?

                                <form onSubmit={handleSubmitTask}>
                                    <input type="text" value={submitCommit} onChange={(e) => {
                                        setSubmitCommit(e.target.value)
                                    }} />
                                    <button type="button" className={styles.button} onClick={handleClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7L10 17l-5-5" />
                                        </svg>
                                        <span className={styles.span}>Submit Task</span>
                                    </button>
                                    <button type="button" onClick={toggleSideBar} className={styles["secondary-button"]}>
                                        <span>Cancel task</span>
                                    </button>
                                </form>
                                :
                                status === "WAITING FOR SIGNER" ?
                                    <div>
                                        
                                        <form onSubmit={submitVerdict} className={styles.form}>
                                            <select className={styles.dropdown} value={verdict} onChange={handleVerdict}>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <button type="submit" className={styles.button}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7L10 17l-5-5" />
                                                </svg>
                                                <span className={styles.span}>Sign Task</span>
                                            </button>
                                            <button type="button" onClick={toggleSideBar} className={styles["secondary-button"]}>
                                                <span>Cancel task</span>
                                            </button>
                                        </form>
                                    </div>
                                    : null


                    }

                </div>
                <div className={styles["sidebar-controls"]}>

                </div>
                <button type="button" onClick={toggleSideBar} className={styles["sidebar-close-button"]}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
                        <path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z" />
                    </svg>
                </button>

            </div>
        </div>

    )
}

export default Sidebar