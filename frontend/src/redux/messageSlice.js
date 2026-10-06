import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:[]
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages = action.payload
        },
        addMessage:(state,action)=>{
            const msg = action.payload;
            if(!msg) return;
            // Guard against duplicates from re-subscribes / REST + socket echo
            if(msg._id && state.messages.some((m)=>m?._id===msg._id)) return;
            state.messages.push(msg);
        }
    }
})

export const {setMessages,addMessage} = messageSlice.actions;
export default messageSlice.reducer;