import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"
import { postponeWithTracking } from "next/dist/server/app-render/dynamic-rendering";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer
    }
})