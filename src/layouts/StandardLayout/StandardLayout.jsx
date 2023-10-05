import React from 'react'
import styles from "./StandardLayout.module.css"
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/Header/Header';

export default function StandardLayout() {
  const authenticated = useSelector(state => state.auth.authenticated);
  const location = useLocation()
  const setDataStatus = useSelector(state => state.user.setDataStatus)

  return (
    <section className={styles.wrapper}>
      {
        location.pathname === "/signin" ?
          <div className={styles["img-background"]}></div>
          :
          null
      }
      {
        authenticated ?
          <Header />
          :
          null
      }
      <main className={styles.main}>
        <Outlet />
      </main>
    </section>
  )
}

