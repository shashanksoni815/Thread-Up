import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/userLayout';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./styles.module.css"
import { BASE_URL } from '@/config';

const Dashboard = () => {

  const router = useRouter();

  const dispath = useDispatch();

  const authState = useSelector((state) => state.auth)

  useEffect(() => {
    if(authState.isTokenThere) {
      dispath(getAllPosts())
      dispath(getAboutUser({token: localStorage.getItem('token')}))
    }

    if(!authState.all_profiles_fetched) {
      dispath(getAllUsers())
    }

  }, [ authState.isTokenThere])


  if(authState.user) {
    return (
      <UserLayout>
        
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.createPostContainer}>
            <img width={200} src={`${BASE_URL}/${authState?.user?.userId?.profilePicture }`} alt="" />
            <textarea name="" id=""></textarea>
            <label htmlFor="fileUpload">
              <div className="fab">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <input type="file" hidden id='fileUpload' />
            </label>


          </div>
        </div>
      </DashboardLayout>
  
      </UserLayout>
    )
  } else {
    return (
      <UserLayout>
        
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.createPostContainer}>
            {/* <img src={`${BASE_URL}/${authState?.user?.userId?.profilePicture }`} alt="" /> */}
            <h3>Loading...</h3>
          </div>
        </div>
      </DashboardLayout>
  
      </UserLayout>
    )
  }
}

export default Dashboard;