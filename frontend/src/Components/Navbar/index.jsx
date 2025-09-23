import React from 'react';
import styles from "./styles.module.css";
import { useRouter } from 'next/router';

const NavBarComponent = () => {

  const router = useRouter();

  return (
    <div className={styles.container} >
        
        <nav className={styles.navBar}>

          <h1 style={{cursor:"pointer"}} onClick={() => {
            router.push("/")
          }} >Stay Connected</h1>

          <div className={styles.navBarOption}>
            <div onClick={() => {
              router.push("/login")
            }} className={styles.buttonJoin} >
            <p>Be a part</p>
            </div>
          </div>
        </nav>
    </div>
  )
}

export default NavBarComponent