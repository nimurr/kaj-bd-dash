import React, { useState } from 'react';
import { Table, Select, DatePicker, ConfigProvider, Form } from 'antd';
import moment from 'moment';
import { useGetAllWorkTrakerQuery } from '../../redux/features/WorkTraker/workTraker';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Item } = Form;

const WorkTraker = () => {
    const navigate = useNavigate();

    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState('3222-12-31');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useGetAllWorkTrakerQuery({
        from: fromDate,
        to: toDate,
        status: selectedStatus,
        page,
        limit,
    });

    const dataSource = data?.data?.attributes?.results || [];
    const total = (data?.data?.attributes?.totalPages || 0) * limit;

    const columns = [
        {
            title: 'No',
            render: (_, __, index) => (page - 1) * limit + index + 1,
        },
        {
            title: 'Service Booking Id',
            dataIndex: '_ServiceBookingId',
            render: (text) => text?.slice(-7) || 'N/A',
        },
        {
            title: 'Username',
            dataIndex: ['userId', 'name'],
        },
        {
            title: 'User Phone Number',
            dataIndex: ['userId', 'phoneNumber'],
        },
        {
            title: 'Provider Name',
            dataIndex: ['providerId', 'name'],
        },
        {
            title: 'Provider Phone Number',
            dataIndex: ['providerId', 'phoneNumber'],
        },
        {
            title: 'Services Booking Date',
            dataIndex: 'bookingDateTime',
            render: (date) => moment(date).format('DD MMM YYYY, h:mm A'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                const colorMap = {
                    pending: 'orange',
                    cancelled: 'red',
                    completed: 'green',
                    accepted: 'blue',
                    paymentRequest: 'purple',
                    inProgress: 'orange',
                };

                return (
                    <span
                        className={`capitalize px-3 py-1 rounded-lg text-sm
                        text-${colorMap[status] || 'gray'}-600
                        bg-${colorMap[status] || 'gray'}-100`}
                    >
                        {status}
                    </span>
                );
            },
        },
    ];

    const handlePageChange = (page, pageSize) => {
        setPage(page);
        setLimit(pageSize);
    };

    const onRowClick = (record) => {
        navigate(
            `/work-traker/${record.status === 'completed' ? 'completed' : 'others'}/${record._ServiceBookingId}`
        );
    };

    return (
        <div className="p-5">
            <div className="flex justify-between items-center flex-wrap mb-4">
                <h1 className="text-2xl font-semibold">Work Tracker</h1>

                <Form layout="inline" className="flex gap-2 flex-wrap">
                    <Item>
                        <DatePicker
                            onChange={(d) => setFromDate(d ? d.format('YYYY-MM-DD') : '')}
                            placeholder="From Date"
                        />
                    </Item>
                    <Item>
                        <DatePicker
                            onChange={(d) => setToDate(d ? d.format('YYYY-MM-DD') : '')}
                            placeholder="To Date"
                        />
                    </Item>
                    <Select
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        style={{ width: 160 }}
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
                </Form>
            </div>

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: '#778beb',
                            headerColor: '#fff',
                        },
                    },
                }}
            >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="_ServiceBookingId"
                    loading={isLoading}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20'],
                        onChange: handlePageChange,
                    }}
                    onRow={(record) => ({
                        onClick: () => onRowClick(record),
                        className: 'cursor-pointer',
                    })}
                />
            </ConfigProvider>
        </div>
    );
};

export default WorkTraker;
