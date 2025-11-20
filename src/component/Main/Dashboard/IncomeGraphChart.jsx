import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomeGraphChart = ({fullData}) => {
  // Sample Data for Income and Expenses over the months
  const data = [
    { month: 'Jan', income: 4, expenses: 2 },
    { month: 'Feb', income: 9, expenses: 6 },
    { month: 'Mar', income: 9.1, expenses: 8 },
    { month: 'Apr', income: 3, expenses: 6.5 },
    { month: 'May', income: 12, expenses: 7 },
    { month: 'Jun', income: 12.9, expenses: 4 },
    { month: 'Jul', income: 6, expenses: 8 },
    { month: 'Aug', income: 7, expenses: 5 },
    { month: 'Sep', income: 8, expenses: 6 },
    { month: 'Oct', income: 10, expenses: 7.5 },
    { month: 'Nov', income: 11, expenses: 8 },
    { month: 'Dec', income: 12, expenses: 9 },
  ];

  return (
    <section className="w-full col-span-full md:col-span-4 bg-white rounded-xl border-2 border-[#778beb] shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
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
  );
};

export default IncomeGraphChart;
