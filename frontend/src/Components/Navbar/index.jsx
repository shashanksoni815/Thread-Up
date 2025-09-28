import React from 'react';
import styles from "./styles.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

const NavBarComponent = () => {

  const authState = useSelector((state) => state.auth)

  const router = useRouter();

  const dispatch = useDispatch()

  return (
    <div className={styles.container} >
        
        <nav className={styles.navBar}>

          <h1 style={{cursor:"pointer"}} onClick={() => {
            router.push("/")
          }} >Stay Connected</h1>

          <div className={styles.navBarOption}>

            { authState.profileFetched && <div>
              <div style={{display: "flex", gap: "1.2rem"}} >
                <p>Hey, {authState.user.userId.name}</p>
                <p style={{fontWeight: "bold", cursor: "pointer"}} >Profile</p>

                <p onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/login")
                  dispatch(reset())
                }} style={{fontWeight: "bold", cursor: "pointer"}} >Logout</p>

              </div>
            </div> }

            {!authState.profileFetched && <div onClick={() => {
              router.push("/login")
            }} className={styles.buttonJoin} >
            <p>Be a part</p>
            </div> }
          </div> 
        </nav>
    </div>
  )
}

export default NavBarComponent