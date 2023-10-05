import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from "./Home.module.css"
import { fetchUserData } from '../../redux/slices/GithubSlice';
import Search from '../../components/Search/Search';
import SearchResults from '../../components/SearchResults/SearchResults';
import { fetchTasks } from '../../redux/slices/TaskSlice';

export default function Home() {
  const address = useSelector(state => state.auth.address)
  const dispatch = useDispatch()
  const contributions = useSelector(state => state.github.contributions)
  const languages = useSelector(state => state.github.languages)
  const allTasks = useSelector(state => state.task.allTasks)

  useEffect(() => {
    if (!contributions || !languages) {
      dispatch(fetchUserData())
    }

    const runFetchTasks = async () => {
      await dispatch(fetchTasks())
    }

    if (!allTasks) {
      runFetchTasks()
    }
  }, []);

  return (
    <section className={styles.wrapper}>
      <Search />
      <SearchResults />
    </section>
  );
};
