import { FaDatabase, FaUserCircle, FaUserFriends } from "react-icons/fa";
import { PiCurrencyCircleDollar, PiUsers, PiUsersThreeFill } from "react-icons/pi";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";
import { IoIosTrendingUp } from "react-icons/io";
import { IoTrendingDown } from "react-icons/io5";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
const Status = ({ fullData, isLoading }) => {

  console.log(fullData)
  const user = JSON.parse(localStorage.getItem("user"));



  return (
    <div>
      {
        isLoading ?
          <div className='grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-3 grid-cols-1'>
            {
              [...Array(4)].map((_, i) => (
                <div class="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
                  <div class="flex animate-pulse space-x-4">
                    <div class="size-10 rounded-full bg-[#778beb]"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 rounded bg-[#778beb]"></div>
                      <div class="h-2 rounded bg-[#778beb]"></div>
                      <div class="h-2 rounded bg-[#778beb]"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="col-span-2 h-2 rounded bg-[#778beb]"></div>
                          <div class="col-span-1 h-2 rounded bg-[#778beb]"></div>
                        </div>
                        <div class="h-2 rounded bg-[#778beb]"></div>
                        <div class="h-2 rounded bg-[#778beb]"></div>
                        <div class="h-2 rounded bg-[#778beb]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div> :
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            <div className="flex justify-between items-start p-5 rounded-lg border-2 border-gray-200">
              <div className="size-20 p-3 flex justify-center items-center rounded-full bg-[#778beb] text-white  ">
                <FaUserCircle className="size-10" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl text-right text-gray-700 font-semibold">Total User</h1>
                <h1 className="text-right text-5xl font-semibold text-[#222222]">
                  {fullData?.currentAndLastMonthUserCount?.allCount}
                </h1>
                <h1 className="text-gray-500 text-right space-x-2">
                  <div className="flex items-center justify-end">
                    <span className={`py-1 px-3 rounded-lg flex items-center  max-w-fit gap-3 ${fullData?.currentAndLastMonthUserCount?.monthlyGrowth > 0 ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"}`}>
                      {fullData?.currentAndLastMonthUserCount?.monthlyGrowth > 0 ? <IoIosTrendingUp /> : <IoTrendingDown />}
                      {fullData?.currentAndLastMonthUserCount?.monthlyGrowth}%
                    </span>
                  </div>
                  Last month total  {fullData?.currentAndLastMonthUserCount?.lastMonthTotal}
                </h1>
              </div>
            </div>



            <div className="flex justify-between items-start p-5 rounded-lg border-2 border-gray-200">
              <div className="size-20 p-3 flex justify-center items-center rounded-full bg-[#778beb] text-white  ">
                <FaUserCircle className="size-10" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl text-right text-gray-700 font-semibold">Total Provider</h1>
                <h1 className="text-right text-5xl font-semibold text-[#222222]">
                  {fullData?.currentAndLastMonthProviderCount?.allCount}
                </h1>
                <h1 className="text-gray-500 text-right space-x-2">
                  <div className="flex items-center justify-end">
                    <span className={`py-1 px-3 rounded-lg flex items-center justify-end max-w-fit gap-3 ${fullData?.currentAndLastMonthProviderCount?.monthlyGrowth > 0 ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"}`}>
                      {fullData?.currentAndLastMonthProviderCount?.monthlyGrowth > 0 ? <IoIosTrendingUp /> : <IoTrendingDown />}
                      {fullData?.currentAndLastMonthProviderCount?.monthlyGrowth}%
                    </span>
                  </div>
                  Last month total  {fullData?.currentAndLastMonthProviderCount?.lastMonthTotal}
                </h1>
              </div>
            </div>


            {
              user.role === 'admin' &&
              <div className="flex justify-between items-start p-5 rounded-lg border-2 border-gray-200">
                <div className="size-20 p-3 flex justify-center items-center rounded-full bg-[#778beb] text-white   ">
                  <PiCurrencyCircleDollar className="size-10" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl text-right text-gray-700 font-semibold">Total Revenue </h1>
                  <h1 className="text-center text-5xl font-semibold text-[#222222]">
                    ৳{fullData?.totalRevenueByMonth?.totalTransactionsAmountForAdmin.toFixed(2) || "0"}
                  </h1>
                </div>
              </div>
            }


            <div className="flex justify-between items-start p-5 rounded-lg border-2 border-gray-200">
              <div className="size-20 p-3 flex justify-center items-center rounded-full bg-[#778beb] text-white  ">
                <MdOutlineMiscellaneousServices className="size-10 border-2 rounded-full p-1" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl text-right text-gray-700 font-semibold">Services booking</h1>
                <h1 className="text-right text-5xl font-semibold text-[#222222]">
                  {fullData?.serviceBookingCount?.allBookingCount}
                </h1>
                <h1 className="text-gray-500 text-right space-x-2">
                  <div className="flex items-center justify-end">
                    <span className={`py-1 px-3 rounded-lg flex items-center justify-end max-w-fit gap-3 ${fullData?.currentAndLastMonthProviderCount?.monthlyGrowth > 0 ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"}`}>
                      {fullData?.currentAndLastMonthProviderCount?.monthlyGrowth > 0 ? <IoIosTrendingUp /> : <IoTrendingDown />}
                      {fullData?.currentAndLastMonthProviderCount?.monthlyGrowth}%
                    </span>
                  </div>
                  Last month total  {fullData?.currentAndLastMonthProviderCount?.lastMonthTotal}
                </h1>
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default Status;
