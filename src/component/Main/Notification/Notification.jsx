import { Pagination } from "antd";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetAllNotificationQuery } from "../../../redux/features/setting/settingApi";
import moment from "moment";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Sample demo notifications data
  const allNotification = {
    notifications: [
      { id: 1, message: "New message from John", createdAt: "2025-09-09T10:00:00Z" },
      { id: 2, message: "Your subscription is about to expire", createdAt: "2025-09-08T14:30:00Z" },
      { id: 3, message: "System update completed successfully", createdAt: "2025-09-07T08:15:00Z" },
      { id: 4, message: "You have a new comment on your post", createdAt: "2025-09-06T16:45:00Z" },
      { id: 5, message: "Reminder: Meeting at 3 PM", createdAt: "2025-09-05T11:00:00Z" },
      { id: 6, message: "Your profile was updated", createdAt: "2025-09-04T19:30:00Z" },
      { id: 7, message: "Password changed successfully", createdAt: "2025-09-03T09:10:00Z" },
      { id: 8, message: "New follower alert", createdAt: "2025-09-02T13:20:00Z" },
      { id: 9, message: "Event reminder: Team meeting at 10 AM", createdAt: "2025-09-01T07:45:00Z" },
      { id: 10, message: "You have a new like on your post", createdAt: "2025-08-31T16:25:00Z" },
      { id: 11, message: "New software update available", createdAt: "2025-08-30T12:55:00Z" },
      { id: 12, message: "Account settings updated", createdAt: "2025-08-29T15:40:00Z" },
      { id: 13, message: "Reminder: Deadline for task submission", createdAt: "2025-08-28T14:10:00Z" },
      { id: 14, message: "New friend request from Alice", createdAt: "2025-08-27T10:30:00Z" },
      { id: 15, message: "Your subscription has been renewed", createdAt: "2025-08-26T13:25:00Z" },
    ]
  };

  const pageSize = 10;

  // Pagination Logic
  const paginatedNotifications = allNotification?.notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <Link to={"/"} className="text-2xl flex items-center mb-4"><FaAngleLeft /> Notification</Link>

      <div className="space-y-4">
        {paginatedNotifications?.map((item) => (
          <div key={item.id} className="border border-[#778beb] hover:bg-[#778beb56] cursor-pointer rounded-md p-4 flex items-center space-x-4">
            <div className="text-[#778beb] border border-[#778beb] rounded-full p-2">
              <span className=" bg-[#778beb] p-1.5 rounded-full absolute ml-4 z-20"></span>
              <IoMdNotificationsOutline size={30} className="relative" />
            </div>
            <div>
              <p className="font-semibold">{item?.message}</p>
              <p className="text-gray-500">{moment(item?.createdAt).fromNow()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Centering the Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          total={allNotification?.notifications.length}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Notification;