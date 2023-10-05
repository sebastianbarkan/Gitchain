import React from 'react'
import SearchIcon from "../../assets/Search.svg"
import styles from "./Search.module.css"
import { useSelector, useDispatch } from 'react-redux';
import { setTaskFilter } from '../../redux/slices/TaskSlice';

function Search() {
  const taskFilter = useSelector(state => state.task.taskFilter)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    dispatch(setTaskFilter(e.target.value))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrap}>
        <input type="text" className={styles.input} value={taskFilter} onChange={handleChange}/>
        <img src={SearchIcon} alt="magnify glass" className={styles["img-search"]} />
      </div>
    </div>
  )
}

export default Search