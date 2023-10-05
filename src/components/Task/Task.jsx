import React, { useEffect, useState } from 'react'
import styles from "./Task.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { fetchTaskStatus, initializeSubmission } from '../../redux/slices/TaskSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { submitUserTask, completeUserTask, fetchSubmitterAddress } from '../../redux/slices/TaskSlice'
import tronWeb from '../../tron/tronWeb'

function Task({ info }) {
  const [status, setStatus] = useState(null)
  const [submitCommit, setSubmitCommit] = useState("")
  const [verdict, setVerdict] = useState("")
  const address = useSelector(state => state.auth.address)
  const trustLevel = useSelector(state => state.user.trustLevel)
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(initializeSubmission({ taskId: info.taskId, userLevel: trustLevel }))
  }

  const handleSubmitTask = (e) => {
    e.preventDefault()

    if (submitCommit !== "") {
      dispatch(submitUserTask({ taskId: info.taskId, githubCommit: submitCommit }))
    }
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

        console.log("Fetched Submitter Address:", submitterAddress, tronWeb.defaultAddress);
        if (submitterAddress !== tronWeb.defaultAddress.hex) {
          console.log("LEVEL", trustLevel)
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
      console.log("STA", info.taskId);

      try {
        // The dispatched action will either result in a fulfilled or rejected action
        const actionResult = await dispatch(fetchTaskStatus({ taskId: info.taskId }));

        // Using unwrapResult will throw an error if the action was rejected
        const fetchedStatus = unwrapResult(actionResult);
        setStatus(fetchedStatus)
        console.log("Fetched Task Status:", fetchedStatus);

      } catch (error) {
        console.error("Failed to fetch task status:", error.message);
      }
    }

    getStatus();
  }, []);

  return (
    <div className={styles.wrapper}>
      <p style={{ color: "white" }}>{info.description}</p>
      Task
      {
        status === null ?
          null
          :
          status === "NEW" ?
            <button onClick={handleClick} type='button'>CONNECT TO SUBMISSION</button>
            :
            status === "IN PROGRESS" ?
              <>
                <form onSubmit={handleSubmitTask}>
                  <p>IN PROGRESS</p>
                  <input type="text" value={submitCommit} onChange={(e) => {
                    setSubmitCommit(e.target.value)
                  }} />
                  <button type='submit'>SUbmit</button>
                </form>

              </>
              :
              status === "WAITING FOR SIGNER" ?
                <>
                  <form onSubmit={submitVerdict}>
                    <input type="text" value={verdict} onChange={handleVerdict} />
                    <button type='submit'>SUBMIT VERDICT</button>
                  </form>
                </>
                : null

      }

    </div >
  )
}

export default Task