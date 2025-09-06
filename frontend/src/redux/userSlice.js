import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        authUser:null,
        allOthersUser:[],
        selectedUser:[],
        input:"",
        onlineUsers:null
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload
        },
        setAllOthersUser:(state,action)=>{
            state.allOthersUser = action.payload
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload
        },
        setInput:(state,action)=>{
            state.input = action.payload
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        }
    }
})

export const {setAuthUser,setAllOthersUser,setSelectedUser,setInput,setOnlineUsers} = userSlice.actions;
export default userSlice.reducer;