import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from "./Home.module.css"
import { fetchUserData } from '../../redux/slices/GithubSlice';

export default function Home() {
  const address = useSelector(state => state.auth.address)
  const dispatch = useDispatch()
  const contributions = useSelector(state => state.github.contributions)
  const languages = useSelector(state => state.github.languages)
  console.log("address CGECK", address)
  useEffect(() => {
    if (!contributions || !languages) {
      dispatch(fetchUserData())
    }
  }, []);

  return (
    <section className={styles.wrapper}>
      <h1>HOME BOI</h1>
    </section>
  );
};
