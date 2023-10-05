import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import styles from "./SearchResults.module.css"
import Task from "../Task/Task"
import Fuse from 'fuse.js'

function SearchResults() {
  const dispatch = useDispatch();
  const allTasks = useSelector(state => state.task.allTasks);
  const taskFilter = useSelector(state => state.task.taskFilter);

  const fuseOptions = {
    keys: ['description', "category"],
    threshold: 0.3,
  };

  const fuse = new Fuse(allTasks, fuseOptions);
  let results;
  useEffect(() => {
    if (taskFilter) {
      results = fuse.search(taskFilter);
    }

  }, [taskFilter, allTasks])


  console.log("TAKSS", allTasks)
  return (
    <div className={styles.wrapper}>
      {
        results !== null && results !== undefined ?
          results.map((result, i) => (
            <Task key={i} {...result.item} />
          ))
          :
          <p>Waiting for work, take a break and relax</p>
      }
    </div>
  )
}

export default SearchResults