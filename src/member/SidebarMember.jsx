import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoChatbox, IoLogOut } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

const SidebarMember = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = localStorage.getItem("user_id");
    if (user) {
      setUserData({ email: user.email, id: userId });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-[#171717] text-white flex flex-col">
      <div className="p-4 text-lg border-b text-[#b4b4b4] border-[#212121]">
        Member Panel
        <div className="text-sm text-[#b4b4b4] border-b border-[#212121]">
          <p>{userData.email || "Not available"}</p>
          {/* <p>
          <strong>ID:</strong> {userData.id || "Not available"}
        </p> */}
        </div>
      </div>
      {/* Display Email and ID */}

      <nav className="scrollBar flex-1 overflow-y-auto border-[#676767] scrollbar scrollbar-thumb-[#676767] scrollbar-track-transparent">
        <ul className="space-y-2 p-4">
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `flex items-center px-2 py-1 rounded ${
                  isActive ? "bg-[#212121]" : ""
                }`
              }
            >
              <IoChatbox style={{ marginRight: "5px" }} />
              Chat
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/changepassword"
              className={({ isActive }) =>
                `flex items-center px-2 py-1 rounded ${
                  isActive ? "bg-[#212121]" : ""
                }`
              }
            >
              <RiLockPasswordFill style={{ marginRight: "5px" }} />
              Change Password
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-[#212121] text-center flex items-center ">
        <button
          onClick={handleLogout}
          className="px-2 py-1 text-white rounded flex flex-row items-center justify-center border-0 hover:bg-[#212121]"
        >
          <IoLogOut style={{ marginRight: "5px" }} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarMember;
