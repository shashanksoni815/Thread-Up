import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { createPost, deletePost, getAllPosts, incrementPostLike } from '@/config/redux/action/postAction';
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

  const postState = useSelector((state) => state.posts)

  useEffect(() => {
    if(authState.isTokenThere) {
      dispath(getAllPosts())
      dispath(getAboutUser({token: localStorage.getItem('token')}))
    }

    if(!authState.all_profiles_fetched) {
      dispath(getAllUsers())
    }

  }, [ authState.isTokenThere])

  const [postContent, setPostContent] = useState("")
  const [fileContent, setFileContent] = useState()

  const handleUpload = async () => {
    await dispath(createPost({file: fileContent, body: postContent}))
    setFileContent(null)
    setPostContent("")
    dispath(getAllPosts());
  }

  if(authState.user) {
    return (
      <UserLayout>
        
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.createPostContainer}>
            <img className={styles.userProfile} width={200} src={`${BASE_URL}/${authState?.user?.userId?.profilePicture }`} alt="" />
            <textarea onChange={(e) => setPostContent(e.target.value)} value={postContent} placeholder={`What's in your mind? `} className={styles.textarea} name="" id=""></textarea>
            <label htmlFor="fileUpload">
              <div className={styles.fab}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id='fileUpload' />
            </label>
            {postContent.length > 0 
              &&
            <div onClick={handleUpload} className={styles.uploadButton}>
               Post 
            </div>
            }
          </div>

          <div className={styles.postContainer}>
            {postState.posts.map((post) => {
              return (
                <div key={post._id} className={styles.singleCard}>
                  <div className={styles.singleCard_header}>
                    <div className={styles.singleCard_profileContainer}>
                      <img className={styles.userProfile} src={`${BASE_URL}/${authState?.user?.userId?.profilePicture}`} alt="" />
                      <div className={styles.name}  >
                        <div style={{display: "flex", gap:"1.2rem", justifyContent:"space-between"}} > 
                        <p> <b> {post.userId.name} </b></p>
                        {
                          post.userId._id.toString() === authState?.user?.userId?._id.toString() && 
                          <div onClick={async () => {
                           await dispath(deletePost({ post_id: post._id}))
                           await dispath(getAllPosts())
                          }} style={{cursor: "pointer"}} >
                            <p style={{color:"red"}} >Delete</p>
                           
                          </div>
                        }
                        </div>

                        <p style={{color: "grey"}} >@{post.userId.username}</p>
                        <p style={{paddingTop: "0.5em"}} >{post.body}</p>

                        <div className={styles.singleCard_img}>
                          <img src={`${BASE_URL}/${post.media}`} alt="" />
                        </div>

                        <div className={styles.optionsContainer}>
                          <div onClick={ async () => {
                            await dispath(incrementPostLike({post_id: post._id}))
                            dispath(getAllPosts())
                          }} className={styles.singleOption}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg> {post.likes}

                          </div>
                          <div className={styles.singleOption}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>


                          </div>
                          <div  onClick={() => {
                            const text = encodeURIComponent(post.body)
                            const url = encodeURIComponent("Threadup.in")

                            const twitterUrl = `http://threadup.com/${text}/demo/${url}`
                            window.open(twitterUrl, "_blank")
                          }} className={styles.singleOption}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>


                          </div>

                        </div>

                      </div>  
                    </div>
                  </div>
                </div>
              )
            })}
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