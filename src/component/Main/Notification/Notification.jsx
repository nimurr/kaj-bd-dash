import { Pagination } from "antd";
import { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetNotificationsQuery } from "../../../redux/features/notifications/notifications";
import moment from "moment";

const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Number of items per page is fixed at 2

  // Fetch notifications based on the current page and limit
  const { data, isLoading } = useGetNotificationsQuery({ page: currentPage, limit });
  const allNotification = data?.data?.attributes?.results || [];
  const totalResults = data?.data?.attributes?.totalResults || 0; // Total number of items (notifications)
  const totalPages = data?.data?.attributes?.totalPages || 1; // Total number of pages

  // Handle pagination page change
  const onPageChange = (page) => {
    setCurrentPage(page); // Update the current page when user changes page
  };

  return (
    <div className="p-4">
      <Link to={"/"} className="text-2xl flex items-center mb-4"><FaAngleLeft /> Notification</Link>

      <div className="space-y-2">
        {
          isLoading && [...Array(10)].map((_, i) => (
            <div class="mx-auto w-full rounded-md border border-blue-300 p-2">
              <div class="flex animate-pulse space-x-4">
                <div class="size-10 rounded-full bg-gray-200"></div>
                <div class="flex-1 space-y-6 py-1">
                  <div class="h-2 rounded bg-gray-200"></div>
                  <div class="space-y-3">
                    <div class="h-2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>))
        }
        {allNotification?.map((item) => (
          <div key={item.id} className="border border-[#a5b2f5] hover:bg-[#778beb56] cursor-pointer rounded-md p-2 flex items-center space-x-4">
            <div className="text-[#a5b2f5] border border-[#a5b2f5] rounded-full p-2">
              <span className=" bg-[#a5b2f5] p-1.5 rounded-full absolute ml-4 z-20"></span>
              <IoMdNotificationsOutline size={30} className="relative" />
            </div>
            <div>
              <p className=" text-[#666]">{item?.title}</p>
              <p className="text-gray-500">{moment(item?.createdAt).fromNow()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Centering the Pagination */}
      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage} // Set current page
          pageSize={limit} // Set the number of items per page (2 items per page by default)
          total={totalResults} // Total number of items (not total pages)
          onChange={onPageChange} // Update current page when the page is changed
          showSizeChanger={false} // Disable changing page size if you want it to be fixed
        />
      </div>
    </div>
  );
};

export default Notification;
