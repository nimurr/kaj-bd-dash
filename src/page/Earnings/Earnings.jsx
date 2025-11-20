import moment from 'moment';
import React from 'react';
import { useGetEarningsQuery } from '../../redux/features/earnings/earningsApi';

const Earnings = () => {

  const { data, isLoading } = useGetEarningsQuery();
  const fullData = data?.attributes;
  // console.log(fullData);


  return (
    <div className='md:p-5  md:py-6 p-2 '>
      <h2 className='text-3xl mb-5'>Total Earnings</h2>
      {
        isLoading ?
          <div className='grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-3 grid-cols-1'>
            {
              [...Array(10)].map((_, i) => (
                <div class="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
                  <div class="flex animate-pulse space-x-4">
                    <div class="size-10 rounded-full bg-[#778beb]"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 rounded bg-[#778beb]"></div>
                      <div class="h-2 rounded bg-[#778beb]"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="col-span-2 h-2 rounded bg-[#778beb]"></div>
                          <div class="col-span-1 h-2 rounded bg-[#778beb]"></div>
                        </div>
                        <div class="h-2 rounded bg-[#778beb]"></div>
                        <div class="h-2 rounded bg-[#778beb]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          :
          <div className='grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-3 grid-cols-1'>

            <div className='border border-purple-700  text-purple-700  p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>Total Transactions </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '>  </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400'>{fullData?.totalEarnings?.count}</span>
                <h1 className='text-right text-5xl '>{fullData?.totalTransactions || 0}</h1>
              </div>
              <hr />
            </div>
            <div className='border border-green-500  text-green-500 p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>Total Earnings </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400'>{fullData?.totalEarnings?.count}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.totalEarnings || 0}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-red-500  text-red-500  p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>{fullData?.todayEarnings?.label} </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400'>{fullData?.todayEarnings?.count}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.todayEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-blue-500  text-blue-500  p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>{fullData?.thisWeekEarnings?.label} </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400'>{fullData?.thisWeekEarnings?.dateRange}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.thisWeekEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-yellow-500  text-yellow-500  p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>{fullData?.thisMonthEarnings?.label} </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400 capitalize'>{fullData?.thisMonthEarnings?.month}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.thisMonthEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-purple-500  text-purple-500  p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>{fullData?.lastWeekEarnings?.label} </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400'>{fullData?.lastWeekEarnings?.dateRange}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.lastWeekEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-orange-500  text-orange-500 p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>{fullData?.lastMonthEarnings?.label} </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400 capitalize'>{fullData?.lastMonthEarnings?.month}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.lastMonthEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-pink-500  text-pink-500 p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>{fullData?.thisQuarterEarnings?.label} </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400 capitalize'>{fullData?.thisQuarterEarnings?.count}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.thisQuarterEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-indigo-500  text-indigo-500  p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>{fullData?.thisYearEarnings?.label} </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400 capitalize'>{fullData?.thisYearEarnings?.count}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.thisYearEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-red-600  text-red-500 p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>Current Balance </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-between my-5 items-center '>
                <span className='text-xl font-semibold text-gray-400 capitalize'> Token Balance :{fullData?.currentBalance?.tokenBalance}</span>
                <h1 className='text-right text-5xl '>৳{fullData?.thisYearEarnings?.amount}</h1>
              </div>
              <hr />
            </div>

            <div className='border border-lime-600  text-lime-500 p-3 rounded-xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl text-gray-600 font-semibold'>Total Transactions </h2>
                <h2 className='text-3xl text-gray-600 font-semibold '> Earn </h2>
              </div>
              <div className='flex justify-end my-5 items-center '>
                <h1 className='text-right text-5xl '>৳{fullData?.totalTransactions}</h1>
              </div>
              <hr />
            </div>


          </div>
      }
    </div>
  );
}

export default Earnings;
