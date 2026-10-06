import React, { useContext } from 'react';
import OtherUsers from './OtherUsers';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../routes/axiosInstance';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../App';
import { setAuthUser, setAllOthersUser, setSelectedUser, setInput, setOnlineUsers } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { setSocket } from '../redux/socketSlice';
import { persistor } from '../redux/store';
import { IoSearchOutline, IoLogOutOutline, IoChatbubbleEllipsesSharp, IoCloseCircle } from 'react-icons/io5';
import ThemeToggle from './ThemeToggle';
import Avatar from '@mui/material/Avatar';

const Sidebar = () => {
  const navigate = useNavigate();
  const input = useSelector((state) => state.user.input);
  const authUser = useSelector((state) => state.user.authUser);
  const dispatch = useDispatch();
  const socketObj = useContext(SocketContext);

  function clearClientSession() {
    try {
      socketObj?.close();
    } catch {
      // ignore socket close errors during logout
    }
    localStorage.removeItem("token");
    dispatch(setAuthUser(null));
    dispatch(setSelectedUser([]));
    dispatch(setAllOthersUser([]));
    dispatch(setMessages([]));
    dispatch(setOnlineUsers([]));
    dispatch(setInput(""));
    dispatch(setSocket(null));
    persistor.purge();
  }

  async function handleLogout() {
    try {
      let response = await axiosInstance.get("/users/logout");
      if (response?.data?.success) {
        toast.success(response.data.message || "Logged out successfully");
      } else {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error?.message || "Logout failed, clearing local session");
    } finally {
      clearClientSession();
      navigate("/login", { replace: true });
    }
  }

  return (
    <aside
      aria-label="Chat sidebar"
      className='w-full h-full flex flex-col md:border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl relative transition-colors duration-300'
    >
      {/* Top Header / App Brand & Theme Toggle */}
      <div className='p-3 sm:p-4 pb-3 border-b border-[var(--sidebar-border)] flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2.5 min-w-0'>
          <div className='w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0'>
            <IoChatbubbleEllipsesSharp className='text-white text-lg' />
          </div>
          <span className='font-bold text-lg tracking-tight text-[var(--text-heading)] truncate'>
            PulseChat
          </span>
        </div>

        <div className='flex items-center gap-1.5 flex-shrink-0'>
          <ThemeToggle />
          {authUser?.fullname && (
            <div className='hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-[11px] font-semibold text-[var(--text-muted)]'>
              <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
              <span className='truncate max-w-[80px]'>{authUser.fullname.split(" ")[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className='p-3 sm:p-3.5 pb-2'>
        <form onSubmit={(e) => e.preventDefault()} className='relative flex items-center'>
          <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none text-base'>
            <IoSearchOutline />
          </span>
          <input
            type="search"
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            name="search"
            id="search"
            aria-label="Search contacts"
            placeholder='Search here...'
            className='glass-input w-full pl-10 pr-9 py-2 rounded-xl text-[16px] sm:text-sm font-medium'
          />
          {input && (
            <button
              type="button"
              onClick={() => dispatch(setInput(""))}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text-heading)] transition-colors p-1'
              aria-label="Clear search query"
            >
              <IoCloseCircle className='text-base' />
            </button>
          )}
        </form>
      </div>

      {/* Contact List */}
      <div className='flex-1 overflow-y-auto px-2 py-1 min-h-0 momentum-scroll'>
        <OtherUsers />
      </div>

      {/* Bottom Logout Section */}
      <div className='p-3 border-t border-[var(--sidebar-border)] bg-[var(--card-bg)] flex items-center justify-between transition-colors duration-300'>
        <div className='flex items-center gap-2.5 min-w-0'>
          <Avatar
            src={authUser?.profilePhoto}
            alt={authUser?.fullname || "Account"}
            sx={{
              width: 34,
              height: 34,
              fontSize: '0.85rem',
              fontWeight: 700,
              bgcolor: 'rgba(99, 102, 241, 0.25)',
              color: 'var(--text-heading)',
              border: '1px solid var(--card-border-elevated)'
            }}
          >
            {authUser?.fullname ? authUser.fullname.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <div className='truncate'>
            <p className='text-xs font-semibold text-[var(--text-heading)] truncate'>{authUser?.fullname || "Account"}</p>
            <p className='text-[10px] text-[var(--text-subtle)] truncate'>@{authUser?.username || "online"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer'
          title="Sign out of your session"
        >
          <IoLogOutOutline className='text-base' />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;