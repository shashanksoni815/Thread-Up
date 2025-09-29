import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";





export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkApi) => {
        try {
            
            const response = await clientServer.get('/posts')

            return thunkApi.fulfillWithValue(response.data)

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkApi) => {
        const {file, body} = userData;
        try {
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'))
            formData.append('body', body)
            formData.append('media', file)

            const response = await clientServer.post("/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                return thunkApi.fulfillWithValue("Post Uploaded")
            } else {
                return thunkApi.rejectWithValue("Post not Uploaded")

            }

        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id, thunkApi) => {
        try {

            const response = await clientServer.delete("/delete_post", {
                data: {
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id
                }
            })
            
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
)
