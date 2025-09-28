import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction'
import { getAllPosts } from '@/config/redux/action/postAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Explore = () => {
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)

  useEffect(() => {
    // if(authState.isTokenThere) {
    //   dispath(getAllPosts())
    //   dispath(getAboutUser({token: localStorage.getItem('token')}))
    // }
    if(!authState.all_profiles_fetched) {
      dispatch(getAllUsers())
    }


  }, [ authState.isTokenThere])

  return (
    <UserLayout>
      
    <DashboardLayout>
      <h1>Explore</h1>
    </DashboardLayout>

    </UserLayout>
  )
}

export default Explore