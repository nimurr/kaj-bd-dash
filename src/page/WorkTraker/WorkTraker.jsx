import React, { useState, useEffect } from 'react';
import { Table, Select, DatePicker, ConfigProvider, Form } from 'antd';
import moment from 'moment';
import { useGetAllWorkTrakerQuery } from '../../redux/features/WorkTraker/workTraker';
import { useNavigate } from 'react-router-dom';
import Item from 'antd/es/list/Item';

const { Option } = Select;

const WorkTraker = () => {
    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState('3222-12-31');
    const [selectedMonth, setSelectedMonth] = useState(null); // For storing selected month
    const [selectedStatus, setSelectedStatus] = useState(''); // For storing selected status filter
    const [selectedMonthly, setSelectedMonthly] = useState('');
    const [dataSource, setDataSource] = useState([]);

    const { data } = useGetAllWorkTrakerQuery({ from: fromDate, to: toDate, status: selectedStatus });
    const fullData = data?.data?.attributes?.results;

    console.log(fullData)

    const navigate = useNavigate(); // Initialize navigate for dynamic routing

    // Columns definition for the table
    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: 'Username',
            dataIndex: 'userId',
            key: 'userId',
            render: (text) => <span> {text?.name || 'N/A'}</span>,
        },
        {
            title: 'User Phone Number',
            dataIndex: 'userId',
            key: 'userId',
            render: (text) => <span> {text?.phoneNumber || 'N/A'}</span>,
        },
        {
            title: 'Provider Name',
            dataIndex: 'providerId',
            key: 'providerId',
            render: (text) => <span> {text?.name || 'N/A'}</span>,
        },
        {
            title: 'Provider Phone Number',
            dataIndex: 'providerId',
            key: 'providerId',
            render: (text) => <span> {text?.phoneNumber || 'N/A'}</span>,
        },
        {
            title: 'Services Booking Date',
            dataIndex: 'servicesBookingDate',
            key: 'servicesBookingDate',
            render: (date) => moment(date).format('DD MMM YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                let color = '';
                // Apply color based on status
                switch (text) {
                    case 'pending':
                        color = 'yellow';
                        break;
                    case 'cancelled':
                        color = 'red';
                        break;
                    case 'completed':
                        color = 'green';
                        break;
                    case 'accepted':
                        color = 'blue';
                        break;
                    case 'paymentRequest':
                        color = 'purple';
                        break;
                    case 'inProgress':
                        color = 'orange';
                        break;
                    default:
                        color = 'gray'; // Default color if no status matches
                }
                return (
                    <span
                        className={`${color === 'yellow' && 'text-orange-500 bg-orange-100 py-1 px-3 rounded-lg'
                            } ${color === 'red' && 'text-red-500 bg-red-100 py-1 px-3 rounded-lg'
                            } ${color === 'green' && 'text-green-500 bg-green-100 py-1 px-3 rounded-lg'
                            } ${color === 'blue' && 'text-blue-500 bg-blue-100 py-1 px-3 rounded-lg'
                            } ${color === 'purple' && 'text-purple-500 bg-purple-100 py-1 px-3 rounded-lg'
                            } ${color === 'orange' && 'text-orange-500 bg-orange-100 py-1 px-3 rounded-lg'
                            } ${color === 'gray' && 'text-gray-500 bg-gray-100 py-1 px-3 rounded-lg'
                            }`}
                    >
                        {text}
                    </span>
                );
            },
        },
    ];

    // Filter the data based on the date range and status
    useEffect(() => {
        if (!data) return;

        let filteredData = fullData;

        // Apply date filter
        if (fromDate && toDate) {
            filteredData = filteredData.filter((item) => {
                const bookingDate = moment(item.servicesBookingDate);
                return bookingDate.isBetween(fromDate, toDate, null, '[]');
            });
        }

        // Apply status filter if selected
        if (selectedStatus) {
            filteredData = filteredData.filter(item => item.status === selectedStatus);
        }

        // Apply month filter if selected
        if (selectedMonthly) {
            const month = moment().month(selectedMonthly).format('MM');
            filteredData = filteredData.filter(item => moment(item.servicesBookingDate).month() === parseInt(month) - 1);
        }

        setDataSource(filteredData);
    }, [data, fromDate, toDate, selectedStatus, selectedMonthly]);

    // Handle row click to navigate based on the status
    const onRowClick = (record) => {
        navigate(`/work-traker/${record.status.toLowerCase().replace(' ', '-')}/${record.key}`);
    };

    return (
        <div className="p-5">
            <div className="flex items-center justify-between flex-wrap w-full mb-4">
                <h1 className="text-2xl font-semibold">Work Tracker</h1>
                <div className="mb-4 flex items-center gap-5">
                    <div className=" flex items-center flex-wrap">
                        <Form layout="inline" className="flex space-x-2 gap-2 flex-wrap">
                            <Item name="fromDate">
                                <DatePicker
                                    className="rounded-md border border-[#778beb]"
                                    onChange={(date) => setFromDate(date ? date.format('YYYY-MM-DD') : '')}
                                    placeholder="From Date"
                                />
                            </Item>
                            <Item name="toDate">
                                <DatePicker
                                    className="rounded-md border border-[#778beb]"
                                    onChange={(date) => setToDate(date ? date.format('YYYY-MM-DD') : '')}
                                    placeholder="To Date"
                                />
                            </Item>
                        </Form>
                    </div>
                    <Select
                        value={selectedStatus}
                        onChange={(value) => setSelectedStatus(value)}
                        style={{ width: '150px' }}
                        placeholder="Select Status"
                    >
                        <Option value="">All</Option>
                        <Option value="accepted">Accepted</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="cancelled">Cancelled</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="paymentRequest">Payment Request</Option>
                        <Option value="inProgress">In Progress</Option>
                    </Select>
                </div>
            </div>

            <div>
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
                        dataSource={dataSource}
                        pagination={{
                            pageSize: 3, // Number of items per page
                            total: dataSource.length, // Total number of records
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
