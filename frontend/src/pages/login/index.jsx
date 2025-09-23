import UserLayout from '@/layout/userLayout';
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '@/config/redux/action/authAction';

const LoginComponent = () => {

  const authState = useSelector( (state) => state.auth );

  const dispath = useDispatch()

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")


  useEffect(() => {
    if(authState.loggedIn) {
      // router.push("/dashboard")
    }
  }, [authState.loggedIn])

  const handleRegister = () => {
    console.log("Registering...");
    dispath(registerUser({ username, password, email, name }))
    
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading} >{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              <p style={{color: authState.isError ? "red": "green"}}  >{authState.message.message}</p>
            <div className={styles.inputContainers}>
              <div className={styles.inputRow}>
                <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='Username' />
                <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder='Name' />

              </div>
              <input onChange={(e) => setEmail(e.target.value)} className={styles.inputField} type="email" placeholder='Email' />
              <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" placeholder='Password' />

              <div  onClick={() => {
                if(userLoginMethod) {

                }else {
                  handleRegister();
                }
              }} className={styles.buttonWithOutline}>
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>

            </div>


          </div>
          <div className={styles.cardContainer_right}>

          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default LoginComponent;