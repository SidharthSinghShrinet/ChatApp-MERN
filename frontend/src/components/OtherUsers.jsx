import React, { useEffect } from 'react'
import { axiosInstance } from '../routes/axiosInstance'
import { setAllOthersUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import OtherUser from './OtherUser';

const OtherUsers = () => {
    const dispatch = useDispatch();
    async function getOtherData() {
        let response = await axiosInstance.get('/users/others');
        // console.log(response.data.data);
        dispatch(setAllOthersUser(response.data.data));
    };
    useEffect(()=>{
        getOtherData();
    },[]);
  return (
    <OtherUser/>
  )
}

export default OtherUsers