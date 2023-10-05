import React from 'react'
import styles from "./Header.module.css"
import { Link } from 'react-router-dom'
import GithubAuth from '../../utils/GithubAuth/GithubAuth'
import Brand from "../../assets/Brand.png"
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Avatar from 'react-avatar';

function Header() {
  const address = useSelector(state => state.auth.address)
  const githubAuth = useSelector(state => state.github.githubAuth)
  const trustLevel = useSelector(state => state.user.trustLevel)
  const location = useLocation()


  const formattedAddress = () => {
    const firstThree = address.slice(0, 3)
    const lastThree = address.slice(address.length - 3)
    return `${firstThree}...${lastThree}`
  }


  return (
    <section className={styles.wrapper}>
      <img src={Brand} className={styles["img-brand"]} alt="gitchain logo" />
      <span className={styles["links-wrap"]}>
        <Link
          to="/"
          className={
            location.pathname === "/" ?
            styles.linkActive
            :
            styles.link
          }
        >
          Home
        </Link>
        <Link
          to="submissions"
          className={
            location.pathname === "/submissions" ?
            styles.linkActive
            :
            styles.link
          }
        >
          Submissions
        </Link>
        <Link 
           to="createtask"
           className={
            location.pathname === "/createtask" ?
            styles.linkActive
            :
            styles.link
          }
        >
          Create Task
        </Link>
        {
          githubAuth ?
            <>
              <p className={styles.trust}>{trustLevel}</p>
              <Link
                to="profile"
                className={
                  location.pathname === "/profile" ?
                  styles["link-profile-active"]
                  :
                  styles["link-profile"]
                }
              >
                <Avatar 
                  name={`${address}`}
                  round={true}
                  size='32'
                  className={styles.avatar}
                />
                {formattedAddress()}
              </Link>
            </>

            :
            <>
              <GithubAuth />
            </>
        }

      </span>
    </section>
  )
}

export default Header