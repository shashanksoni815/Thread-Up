import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {

  const router = useRouter();

  const [isTokenThere, setIsTokenThere] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('token') === null) {
      router.push('/login')
    }

    setIsTokenThere(true)
  })

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;