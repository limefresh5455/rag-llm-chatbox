import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoChatbox, IoLogOut } from "react-icons/io5";
import { FaUserFriends, FaUsers, FaUser, FaSyncAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import Logo from "../assets/revology_analytics_logo_white-01.png";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState({
    users: false,
    settings: false,
    members: false,
  });
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = localStorage.getItem("user_id");
    if (user) {
      setUserData({ email: user.email, id: userId, isAdmin: user.role });
    }
  }, []);

  return (
    <div className="h-screen w-64 bg-[#171717] text-white flex flex-col">
      <div className="p-4 text-lg border-b text-[#b4b4b4] border-[#212121] flex items-center w-full">
        <img src={Logo} alt="Logo" className="h-10 w-10 mr-2 flex-shrink-0" />
        <div className="overflow-hidden">
          Admin Panel
          <div className="text-xs text-[#b4b4b4] border-b border-[#212121] overflow-hidden">
            <p className="break-words whitespace-normal overflow-hidden text-ellipsis">
              {userData.email || "Not available"}
            </p>
          </div>
        </div>
      </div>

      <nav className="scrollBar flex-1 overflow-y-auto border-[#676767] scrollbar scrollbar-thumb-[#676767] scrollbar-track-transparent">
        <ul className="space-y-2 p-4">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-2 py-1 rounded ${
                  isActive ? "bg-[#212121]" : ""
                }`
              }
            >
              <MdDashboard style={{ marginRight: "5px" }} />
              Dashboard
            </NavLink>
          </li>
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
            <button
              onClick={() => toggleMenu("members")}
              className="w-full flex items-center px-2 py-1 hover:bg-[#212121] rounded"
            >
              <FaUserFriends style={{ marginRight: "5px" }} />
              Members
            </button>
            {openMenu.members && (
              <ul className="pl-6 space-y-2 mt-2">
                <li>
                  <NavLink
                    to="/members"
                    end
                    className={({ isActive }) =>
                      `flex items-center px-2 py-1 text-gray-300 rounded ${
                        isActive ? "bg-[#212121]" : ""
                      }`
                    }
                  >
                    <FaUsers style={{ marginRight: "5px" }} />
                    All Members
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/members/new"
                    className={({ isActive }) =>
                      `flex items-center px-2 py-1 text-gray-300 rounded ${
                        isActive ? "bg-[#212121]" : ""
                      }`
                    }
                  >
                    <FaUser style={{ marginRight: "5px" }} />
                    Add New Member
                  </NavLink>
                </li>
              </ul>
            )}
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

          <li>
            {userData.isAdmin && (
              <NavLink
                to="/trigger"
                className={({ isActive }) =>
                  `flex items-center px-2 py-1 rounded ${
                    isActive ? "bg-[#212121]" : ""
                  }`
                }
              >
                <FaSyncAlt style={{ marginRight: "5px" }} />
                Synced documents
              </NavLink>
            )}
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
      {/* <div className="p-4 border-t border-[#212121] text-center text-sm">
        © 2024 Your Company
      </div> */}
    </div>
  );
};

export default Sidebar;
