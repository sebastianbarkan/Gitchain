import React from 'react';
import Person from "../../assets/Person.svg"
import styles from "./GithubAuth.module.css"

function GithubAuth() {
  const handleOAuth = async () => {
    try {
      window.location.href = 'http://localhost:3001/auth/github';

    } catch (error) {
      console.error('OAuth initiation failed:', error);
    }
  };

  return (
    <button onClick={handleOAuth} className={styles.btn}>
      <img src={Person} alt="person logo" className={styles["img-person"]}></img>
      <p>Find a job</p>
    </button>
  );
}

export default GithubAuth;
