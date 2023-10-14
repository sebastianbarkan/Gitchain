import React, { useEffect, useState } from 'react'
import styles from "./Task.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { fetchTaskStatus, initializeSubmission } from '../../redux/slices/TaskSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { submitUserTask, completeUserTask, fetchSubmitterAddress } from '../../redux/slices/TaskSlice'
import tronWeb from '../../tron/tronWeb'
import { setOpen, setInfo } from '../../redux/slices/DisplaySlice'
import { fetchConvertedValue } from '../../redux/slices/ConversionSlice';

function Task({ info }) {

  const [submitCommit, setSubmitCommit] = useState("")

  const dispatch = useDispatch()

  const convertedValue = useSelector(state => state.conversion.convertedValue);
  const handleSubmitTask = (e) => {
    e.preventDefault()

    if (submitCommit !== "") {
      dispatch(submitUserTask({ taskId: info.taskId, githubCommit: submitCommit }))
    }
  }


  const toggleOpen = () => {

    dispatch(setInfo(info))
    dispatch(setOpen(true))
  }

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
  }, [info.amount])

  return (
    <div className={styles.wrapper} onClick={toggleOpen}>

      <div className={styles.card}>
        <div className={styles["card-header"]}>
          <div className={styles["base-details"]}>
            {console.log("INFO", info)}
            <p className={styles["task-name"]}>{info.amount} TRX</p>
            <div className={styles.subject}>
              <p className={styles["subject-text"]}>{info.category}</p>
            </div>
            <span className={styles.languageWrap}>
              {
                info.languages.map((e, i) => {
                  return <p className={styles.stack}>{e.label}</p>
                })
              }
            </span>
          </div>
          <div className={styles.badges}>
            <div className={styles.badge}>
              <div className={styles["badge-value-container-outer"]}>
                <div className={styles["badge-value-container"]}>
                  <p className={styles["badge-value"]}>${convertedValue.toFixed(0)}</p>
                </div>
              </div>
              <p className={styles["badge-name"]}>Reward</p>
            </div>
            <div className={styles.badge}>
              <div className={styles["badge-value-container-outer"]}>
                <div className={styles["badge-value-container"]}>
                  <p className={styles["badge-value"]}>1</p>
                </div>
              </div>
              <p className={styles["badge-name"]}>Level</p>
            </div>
          </div>
        </div>
        <div className={styles["card-body"]}>
          <p className={styles["card-description"]}>
            {info.description}
          </p>
        </div>
        <div className={styles["card-footer"]}>

          <div className={styles["card-author"]}>
            <p className={styles.author}>{info.taskId}</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Task