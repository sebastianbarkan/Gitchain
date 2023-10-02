import React from 'react'
import styles from "./StandardLayout.module.css"
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/header/Header';

export default function StandardLayout() {
  const authenticated = useSelector(state => state.auth.authenticated);

  return (
    <section className={styles.wrapper}>
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

