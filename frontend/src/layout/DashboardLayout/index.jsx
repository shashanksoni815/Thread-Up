import React, { useEffect } from 'react'
import styles from "./style.module.css";
import { useRouter } from 'next/router';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';

const DashboardLayout = ({children}) => {

  const router = useRouter();

  const dispath = useDispatch()

  const authState = useSelector((state) => state.auth)

  useEffect(() => {
      if(localStorage.getItem('token') === null) {
        router.push('/login')
      }
  
      dispath(setTokenIsThere())
    }, [])

  return (
    <div className="container">

      <div className={styles.homeContainer}>
        
        <div className={styles.homeContainer_left}>
            <div  onClick={() => router.push("/dashboard")} className={styles.sideBarOptions}>
                <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <p>Scroll</p>
            </div>
            <div onClick={() => router.push("/explore")} className={styles.sideBarOptions}>
                <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>

                <p>Explore</p>
            </div>
            <div onClick={() => router.push("/thread")} className={styles.sideBarOptions}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>


                <p>Threads</p>
            </div>
        </div>

        <div className={styles.homeContainer_feed}>
            {children}
        </div>

        <div className={styles.homeContainer_extra}>
            <h3>Top Profiles</h3>

          {
            authState.all_profiles_fetched && authState.all_users.map((profile) => {
              return (
                <div key={profile._id} className={styles.extraContainer_profile} >
                  <p>{profile.userId.name}</p>
                </div>
              )
            })
          }

        </div>
      </div>


    </div>
  )
}

export default DashboardLayout