import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:[],
        unreadCounts:{}
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
        },
        incrementUnread:(state,action)=>{
            const userId = action.payload;
            if(!userId) return;
            state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + 1;
        },
        clearUnread:(state,action)=>{
            const userId = action.payload;
            if(!userId) return;
            state.unreadCounts[userId] = 0;
        }
    }
})

export const {setMessages,addMessage,incrementUnread,clearUnread} = messageSlice.actions;
export default messageSlice.reducer;