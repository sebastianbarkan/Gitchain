import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from "./SearchResults.module.css";
import Task from "../Task/Task";

function SearchResults() {
  const allTasks = useSelector(state => state.task.allTasks);
  const taskFilter = useSelector(state => state.task.taskFilter);

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (taskFilter) {
      const filteredTasks = allTasks.filter(task => 
        task.description.toLowerCase().includes(taskFilter.toLowerCase()) || 
        (task.category && task.category.toLowerCase().includes(taskFilter.toLowerCase()))
      );
      setSearchResults(filteredTasks);
    } else {
      setSearchResults(allTasks); // if there's no filter, show all tasks
    }
  }, [taskFilter, allTasks]);

  return (
    <div className={styles.wrapper}>
      {
        searchResults && searchResults.length > 0 ?
          searchResults.map((e, i) => <Task info={e} key={i} />)
          :
          <p>Waiting for work, take a break and relax</p>
      }
    </div>
  );
}

export default SearchResults;
