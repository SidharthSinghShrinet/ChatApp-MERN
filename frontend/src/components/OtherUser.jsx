import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
// import { setSelectedUser } from "../redux/userSlice";

const OtherUser = () => {
  const dispatch = useDispatch();
  let allOtherUsers = useSelector((state) => state.user.allOthersUser);
  let onlineUsers = useSelector((state) => state.user.onlineUsers);
  // console.log(onlineUsers);
  // let isOnline = onlineUsers.includes(allOtherUsers)
  // console.log(isOnline);
  // console.log(allOtherUsers);
  function selectedUserHandler(user) {
    // console.log(user);
    dispatch(setSelectedUser(user));
  }
  let selectedUser = useSelector((state) => state.user.selectedUser);
  // console.log(selectedUser);
  let input = useSelector((state) => state.user.input);
  let filteredInput = allOtherUsers.filter((search) => {
    return search.fullname.toLowerCase().includes(input.toLowerCase().trim());
  });
  // console.log(filteredInput);
  return (
    <>
      {input.length === 0 ? (
        <div className="flex flex-col gap-2 mt-5 w-full h-[445px] overflow-y-auto scroll-smooth">
          {allOtherUsers.length === 0 ? (
            <h1>Loading...</h1>
          ) : (
            allOtherUsers.map((user, idx) => (
              <div
                onClick={() => selectedUserHandler(user)}
                className={`${
                  selectedUser?._id === user?._id ? "bg-black" : ""
                } w-full flex h-12 items-center border-b pb-1 border-gray-300 hover:bg-black rounded-lg relative`}
                key={user._id || idx}
              >
                <img
                  className="w-[25%] h-[100%] object-contain"
                  src={
                    user.profilePhoto ||
                    "https://static.vecteezy.com/system/resources/previews/037/336/395/non_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg"
                  }
                  alt="User Photo"
                />
                {onlineUsers?.includes(user._id) ? (
                  <span className="absolute block w-2 h-2 ml-10 mt-6 bg-green-500 rounded-full ring-2 ring-white"></span>
                ) : (
                  ""
                )}
                <p className="text-md font-bold">{user.fullname || "user"}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-5 w-full h-[445px] overflow-y-auto scroll-smooth">
          {filteredInput.length === 0 ? (
            <h1>No user exists</h1>
          ) : (
            filteredInput.map((user, idx) => (
              <div
                onClick={() => selectedUserHandler(user)}
                className={`${
                  selectedUser?._id === user?._id ? "bg-black" : ""
                } w-full flex h-12 items-center border-b pb-1 border-gray-300 hover:bg-black rounded-lg relative`}
                key={user._id || idx}
              >
                <img
                  className="w-[25%] h-[100%] object-contain"
                  src={
                    user.profilePhoto ||
                    "https://static.vecteezy.com/system/resources/previews/037/336/395/non_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg"
                  }
                  alt="User Photo"
                />
                {onlineUsers?.includes(user._id) ? (
                  <span className="absolute block w-2 h-2 ml-10 mt-6 bg-green-500 rounded-full ring-2 ring-white"></span>
                ) : (
                  ""
                )}

                <p className="text-md font-bold">{user.fullname || "user"}</p>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default OtherUser;
