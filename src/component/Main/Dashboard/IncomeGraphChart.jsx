import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomeGraphChart = ({ fullData, isLoading }) => {

  return (
    <div className='w-full col-span-full md:col-span-4'>
      {
        isLoading ?
          <div className='w-full'>
            <div class="mx-auto w-full rounded-md border border-blue-300 p-4">
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
          </div> :
          <section section className="w-full  bg-white rounded-xl border-2 border-[#778beb] shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <ResponsiveContainer width="100%" height={500} className="pr-5 pt-5">
              <LineChart data={fullData?.totalRevenueByMonth?.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#888', color: 'white', borderRadius: '10px' }} />
                <Legend />

                {/* Line for Income */}
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#778beb" // Green color for income
                  activeDot={{ r: 8 }}
                  strokeWidth={4}
                />
                {/* Line for Expenses */}
                {/* <Line
            type="monotone"
            dataKey="expenses"
            stroke="#778beb60" // Dark green color for expenses
            activeDot={{ r: 8 }}
            strokeWidth={4}
          /> */}
              </LineChart>
            </ResponsiveContainer>
          </section>
      }

    </div >
  );
};

export default IncomeGraphChart;
