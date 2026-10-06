import React from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const isChatOpen = Boolean(selectedUser && selectedUser._id);

  return (
    <div className='w-full max-w-[1280px] h-[100dvh] sm:h-[90vh] sm:max-h-[880px] sm:min-h-[540px] my-auto glass-panel-elevated rounded-none sm:rounded-3xl border-0 sm:border border-[var(--card-border-elevated)] shadow-2xl flex overflow-hidden relative z-10 transition-colors duration-300'>
      {/* Subtle top edge specular highlight (hidden on edge-to-edge mobile) */}
      <div className="hidden sm:block absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-20" />

      {/* Sidebar: Full-width on mobile when no chat is selected, fixed column on tablet/desktop */}
      <div className={`h-full ${isChatOpen ? 'hidden md:flex' : 'flex animate-mobile-fade-in'} w-full md:w-80 lg:w-96 flex-shrink-0 flex-col min-h-0`}>
        <Sidebar />
      </div>

      {/* MessageContainer: Full-width on mobile when chat is open, flexible remaining width on tablet/desktop */}
      <div className={`h-full ${isChatOpen ? 'flex animate-mobile-slide-in' : 'hidden md:flex'} flex-1 flex-col min-w-0 min-h-0`}>
        <MessageContainer />
      </div>
    </div>
  );
};

export default HomePage;