import OtherUsers from './OtherUsers'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../routes/axiosInstance'
import {toast} from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setInput } from '../redux/userSlice'

const Sidebar = () => {
  const navigate = useNavigate();
  const input = useSelector((state)=>state.user.input);
  const dispatch = useDispatch();
  async function handleLogout(){
    try {
      let response = await axiosInstance.get("/users/logout");
      if(response.data.success){
        toast.success(response.data.message);
        console.log("Crashing");
        navigate("/login",{replace:true});
        dispatch(setAuthUser(null));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className='border-r border-gray-700 px-2 pb-4'>
        <form action="" className='sticky top-0'>
            <input type="search" value={input} onChange={(e)=>dispatch(setInput(e.target.value))}  name="search" id="search" placeholder='Search here...' className='outline-none p-2 border-1 rounded-md bg-black text-gray-300 font-semibold tracking-wider text-lg border-gray-400'/>
         </form>
         <OtherUsers/>
         <div className='mt-1.0 flex justify-center border-t-1'>
          <button onClick={handleLogout} className='text-md p-2 font-bold hover:text-gray-300 cursor-pointer'>Logout</button>
         </div>
    </div>
  )
}

export default Sidebar