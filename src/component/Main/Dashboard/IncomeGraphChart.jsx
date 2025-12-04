import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomeGraphChart = ({ fullData, isLoading }) => {
  // Format the data to limit the floating-point values to 2 decimal places
  const formattedData = fullData?.totalRevenueByMonth?.monthlyData.map(item => ({
    ...item,
    amount: parseFloat(item?.amount?.toFixed(2)) // Round 'amount' to 2 decimal places
  }));

  return (
    <div className='w-full col-span-full md:col-span-4'>
      {
        isLoading ?
          <div className='w-full'>
            <div className="mx-auto w-full rounded-md border border-blue-300 p-4">
              <div className="flex animate-pulse space-x-4">
                <div className="size-10 rounded-full bg-[#778beb]"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 rounded bg-[#778beb]"></div>
                  <div className="h-2 rounded bg-[#778beb]"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-2 rounded bg-[#778beb]"></div>
                      <div className="col-span-1 h-2 rounded bg-[#778beb]"></div>
                    </div>
                    <div className="h-2 rounded bg-[#778beb]"></div>
                    <div className="h-2 rounded bg-[#778beb]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div> :
          <section className="w-full bg-white rounded-xl border-2 border-[#778beb] shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <ResponsiveContainer width="100%" height={500} className="pr-5 pt-5">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'white', color: 'black', borderRadius: '10px' }} />
                <Legend />

                {/* Line for Income */}
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Income (৳)"
                  stroke="#778beb" // Blue color for income
                  activeDot={{ r: 8 }}
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
      }
    </div>
  );
};

export default IncomeGraphChart;
