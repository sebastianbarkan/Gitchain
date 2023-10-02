import React from 'react'
import styles from "./Header.module.css"
import { Link } from 'react-router-dom'
import GithubAuth from '../../utils/GithubAuth/GithubAuth'

function Header() {
  return (
    <section className={styles.wrapper}>
        <span className={styles["brand-wrap"]}>
            <div>logo/name</div>
        </span>
        <span className={styles["links-wrap"]}>
            <Link to="/">Home</Link>
            <Link to="new">New</Link>
            <GithubAuth />
            <Link to="profile">Profile</Link>
        </span>
    </section>
  )
}

export default Header