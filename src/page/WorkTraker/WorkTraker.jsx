import React, { useState } from 'react';
import { Table, Select, ConfigProvider } from 'antd';
import moment from 'moment';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const { Option } = Select;

// Sample data for the table with 3 statuses: Completed, Cancelled, In Progress
const data = [
    {
        key: '1',
        no: 1,
        username: 'John Doe',
        userPhoneNumber: '123-456-7890',
        providerName: 'Imran Khan',
        providerPhoneNumber: '987-654-3210',
        servicesBookingDate: '2025-09-12',
        status: 'Completed',
    },
    {
        key: '2',
        no: 2,
        username: 'Jane Smith',
        userPhoneNumber: '555-666-7777',
        providerName: 'Ali Ahmed',
        providerPhoneNumber: '999-888-7777',
        servicesBookingDate: '2025-09-13',
        status: 'Cancelled',
    },
    {
        key: '3',
        no: 3,
        username: 'Michael Johnson',
        userPhoneNumber: '222-333-4444',
        providerName: 'Sara Ali',
        providerPhoneNumber: '555-666-7777',
        servicesBookingDate: '2025-09-14',
        status: 'In Progress',
    },
    // Add more records as needed
    {
        key: '4',
        no: 4,
        username: 'Emily Davis',
        userPhoneNumber: '123-789-4567',
        providerName: 'Ahmed Khan',
        providerPhoneNumber: '876-543-2109',
        servicesBookingDate: '2025-09-15',
        status: 'Completed',
    },
    {
        key: '5',
        no: 5,
        username: 'David Lee',
        userPhoneNumber: '111-222-3333',
        providerName: 'Sophia Patel',
        providerPhoneNumber: '444-555-6666',
        servicesBookingDate: '2025-09-16',
        status: 'Cancelled',
    },
];

const columns = [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        render: (text) => <span>{text}</span>,
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'User Phone Number',
        dataIndex: 'userPhoneNumber',
        key: 'userPhoneNumber',
    },
    {
        title: 'Provider Name',
        dataIndex: 'providerName',
        key: 'providerName',
    },
    {
        title: 'Provider Phone Number',
        dataIndex: 'providerPhoneNumber',
        key: 'providerPhoneNumber',
    },
    {
        title: 'Services Booking Date',
        dataIndex: 'servicesBookingDate',
        key: 'servicesBookingDate',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
            let color = '';
            // Dynamically set the color based on the status
            switch (text) {
                case 'In Progress':
                    color = 'yellow';
                    break;
                case 'Cancelled':
                    color = 'red';
                    break;
                case 'Completed':
                    color = 'green';
                    break;
                default:
                    color = 'black'; // Default color if no status matches
            }
            return <span
                className={`
                ${color == "yellow" && "text-orange-400 bg-orange-100 py-1 px-3 rounded-lg"}
                ${color == "red" && "text-red-400 bg-red-100 py-1 px-3 rounded-lg"}
                ${color == "green" && "text-green-400 bg-green-100 py-1 px-3 rounded-lg"}
                
            
                `} >{text}</span>;
        },
    },
];

const WorkTraker = () => {
    const [selectedMonth, setSelectedMonth] = useState(null); // For storing selected month
    const [selectedStatus, setSelectedStatus] = useState(''); // For storing selected status filter
    const [selectedMonthly, setSelectedMonthly] = useState('');
    const navigate = useNavigate(); // Initialize navigate for dynamic routing

    // Filter data based on month and status
    const filterData = (data) => {
        return data.filter((item) => {
            const bookingMonth = moment(item.servicesBookingDate).month(); // Get the month (0-indexed)
            const monthMatches = selectedMonth === null || bookingMonth === selectedMonth;
            const statusMatches = selectedStatus ? item.status === selectedStatus : true;
            return monthMatches && statusMatches;
        });
    };

    // Handle month selection from the calendar
    const onMonthChange = (date, dateString) => {
        const month = date ? date.month() : null;
        setSelectedMonth(month);
    };

    // Handle work status filter change
    const onStatusChange = (value) => {
        setSelectedStatus(value);
    };
    const onStatusChangeMonthly = (value) => {
        setSelectedMonthly(value);
    };

    // Handle row click to navigate based on the status
    const onRowClick = (record) => {
        // Navigate to a dynamic route based on the row's status and key
        navigate(`/work-traker/${record.status.toLowerCase().replace(' ', '-')}/${record.key}`);
    };

    return (
        <div className="p-5">
            <div>
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl font-semibold mb-4">Work Tracker</h1>

                    <div className="mb-4 flex items-center gap-5">
                        <Select
                            value={selectedMonthly}
                            onChange={onStatusChangeMonthly}
                            style={{ width: '150px' }}
                            placeholder="Select Month"
                        >
                            <Option value="">Monthly</Option>
                            <Option value="January">January</Option>
                            <Option value="February">February</Option>
                            <Option value="March">March</Option>
                            <Option value="April">April</Option>
                            <Option value="May">May</Option>
                            <Option value="June">June</Option>
                            <Option value="July">July</Option>
                            <Option value="August">August</Option>
                            <Option value="September">September</Option>
                            <Option value="October">October</Option>
                            <Option value="November">November</Option>
                            <Option value="December">December</Option>
                        </Select>
                        <Select
                            value={selectedStatus}
                            onChange={onStatusChange}
                            style={{ width: '150px' }}
                            placeholder="Select Status"
                        >
                            <Option value="">Work Status</Option>
                            <Option value="Completed">Completed</Option>
                            <Option value="Cancelled">Cancelled</Option>
                            <Option value="In Progress ">In Progress</Option>
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                {/* Table with Pagination */}
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: "#778beb",
                                headerColor: "#fff",
                                headerBorderRadius: 5,
                            },
                        },
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={filterData(data)}
                        pagination={{
                            pageSize: 3, // Number of items per page
                            total: data.length, // Total number of records
                            showSizeChanger: true, // Allow page size changer
                            pageSizeOptions: ['3', '5', '10'], // Page size options
                        }}
                        rowKey="key"
                        onRow={(record) => ({
                            onClick: () => onRowClick(record), // Add onClick handler
                            className: 'cursor-pointer', // Add class for row styling
                        })}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
};

export default WorkTraker;
