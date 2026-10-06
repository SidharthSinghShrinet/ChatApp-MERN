import React, { useEffect } from 'react'
import { axiosInstance } from '../routes/axiosInstance'
import { setAllOthersUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import OtherUser from './OtherUser';

const OtherUsers = () => {
    const dispatch = useDispatch();
    async function getOtherData() {
        try {
            let response = await axiosInstance.get('/users/others');
            if (response?.data?.data) {
                dispatch(setAllOthersUser(response.data.data));
            }
        } catch (error) {
            console.log("Fetch users error:", error?.response?.data?.message || error?.message);
        }
    };
    useEffect(()=>{
        getOtherData();
    },[]);
  return (
    <OtherUser/>
  )
}

export default OtherUsers