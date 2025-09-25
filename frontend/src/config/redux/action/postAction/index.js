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