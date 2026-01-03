/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { useGetUserProfileQuery } from "../../../redux/features/setting/settingApi";
import { useEffect, useRef, useState } from "react";
import Url from "../../../redux/baseApi/forImageUrl";
import { io } from "socket.io-client";
import socketUrl from "../../../utils/socket";

const Header = ({ toggleSidebar }) => {
  const { data: userProfile, refetch } = useGetUserProfileQuery();
  const user = userProfile?.data?.attributes;

  const [isNotification, setIsNotification] = useState(null);

  const socketRef = useRef(null);

  // 🔄 Fetch profile
  useEffect(() => {
    refetch();
  }, [refetch]);

  // 🔔 Listen for admin notifications
  useEffect(() => {

    const notification = localStorage.getItem("isNotification");
    if (notification) {
      setIsNotification(JSON.parse(notification));
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io(socketUrl, {
        auth: { token },
        extraHeaders: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });
    }

    const socket = socketRef.current;

    // ✅ LISTENER
    const handleAdminNotification = (payload) => {
      console.log("🔔 Admin Notification");

      localStorage.setItem("isNotification", JSON.stringify({ isNotification: true }));

      setIsNotification({ isNotification: true });

      refetch();
      // you can update state / redux here
    };

    socket.on("notification::admin", handleAdminNotification);

    // 🧹 Cleanup
    return () => {
      socket.off("notification::admin", handleAdminNotification);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);


  const handleUpdateNotifi = () => {
    setIsNotification({ isNotification: false });
    localStorage.setItem("isNotification", JSON.stringify({ isNotification: false }));
  }

  return (
    <div className="w-full px-5 py-3.5 bg-[#778beb] flex justify-between items-center text-white sticky top-0 left-0 z-10">

      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-white text-3xl"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>
      </div>

      <div className="flex items-center gap-3 mr-3">
        <Link to="/notification">
          <div onClick={handleUpdateNotifi} className="relative text-[#778beb] p-2 rounded-full bg-white">
            <MdNotificationsNone className="size-8" />
            {
              isNotification?.isNotification &&
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            }
          </div>
        </Link>

        <Link to="/settings/personal-info">
          <img
            className="w-12 h-12 border rounded-full"
            src={
              user?.profileImage?.imageUrl?.includes("amazonaws")
                ? user?.profileImage?.imageUrl
                : Url + user?.profileImage?.imageUrl
            }
            alt="User Profile"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;
