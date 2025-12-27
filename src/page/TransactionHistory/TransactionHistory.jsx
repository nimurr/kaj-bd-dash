import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ConfigProvider, Form, DatePicker, message, Input, Pagination } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import Url from '../../redux/baseApi/forImageUrl';
import { useGetPaymentTransactionsHistoryQuery } from '../../redux/features/earnings/earningsApi';

const TransactionHistory = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState([null, null]);
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  // Current page state
    const pageSize = 10; // Number of items per page

    // API call to fetch transaction history
    const { data: withdrawalData, refetch, isLoading } = useGetPaymentTransactionsHistoryQuery({ status, searchText   });
    const fullwithdrawalData = withdrawalData?.attributes?.results || [];
    const totalResults = withdrawalData?.attributes?.totalResults || 0;  // Total number of transactions

    console.log(withdrawalData?.attributes)

    console.log(fullwithdrawalData)

    // Modal visibility handler
    const handleShowDetails = (record) => {
        setModalData(record);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setModalData(null);
    };

    // Filter data based on searchText and date range
    const filteredData = fullwithdrawalData?.filter((request) => {
        let isValid = true;

        // Search filter
        if (searchText) {
            isValid = isValid && (
                request._paymentTransactionId?.toLowerCase().includes(searchText.toLowerCase()) ||
                request.referenceId?.toLowerCase().includes(searchText.toLowerCase()) ||
                request.transactionId?.toLowerCase().includes(searchText.toLowerCase()) ||
                String(request.requestedAmount).includes(searchText)
            );
        }

        // Date filter
        if (selectedDate[0] && selectedDate[1]) {
            const from = selectedDate[0].startOf("day").toISOString();
            const to = selectedDate[1].endOf("day").toISOString();
            isValid = isValid && moment(request.requestedAt).isBetween(from, to, null, '[]');
        }

        return isValid;
    });

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);  // Update current page when the page is changed
    };

    // Columns for the table
    const columns = [
        {
            title: 'Requester Info ',
            dataIndex: 'userId',
            key: 'userId',
            render: (s) => <span className='flex items-center gap-3'><img className='w-8 rounded-full h-8' src={s?.profileImage?.imageUrl.includes('amazonaws') ? s?.profileImage?.imageUrl : Url + s?.profileImage?.imageUrl} alt="" /> {s?.name}</span>,
        },
        {
            title: 'Withdraw Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (s) => <span>৳{s}</span>,
        },
        {
            title: 'paymentGateway',
            dataIndex: 'paymentGateway',
            key: 'paymentGateway',
        },
        {
            title: 'Reference Id',
            dataIndex: 'referenceId',
            key: 'referenceId',
        },
        {
            title: 'Payment TransactionId',
            dataIndex: '_paymentTransactionId',
            key: '_paymentTransactionId',
        },
        {
            title: 'Transaction Id',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (s) => <span className={`capitalize ${s === "rejected" ? "text-red-500" : s === "completed" ? "text-green-600" : "text-yellow-600"}`}>{s}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined className='text-2xl' />}
                    onClick={() => handleShowDetails(record)}
                />
            ),
        },
    ];

    return (
        <div className="p-5">
            <div className="flex items-center justify-between flex-wrap my-3 gap-5">
                <h1 className="text-2xl font-semibold mb-4">Transactions History</h1>
                {/* Filter by Period */}
                <Form className="flex items-center flex-wrap md:flex-nowrap gap-5">
                    <Input
                        className="py-1 inline px-2 min-w-[250px] rounded border border-[#778beb]"
                        placeholder="Search by Transaction Id"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        className="py-1 px-5 rounded border border-[#778beb]"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </Form>
            </div>

            {/* Transaction History Table */}
            <div className='w-full overflow-x-auto'>
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
                        dataSource={filteredData}
                        pagination={false}
                        loading={isLoading}
                        rowKey="_paymentTransactionId"
                    />
                </ConfigProvider>
            </div>

            <div>
                <Pagination
                    className="my-5 flex justify-end"
                    current={currentPage}  // Track the current page
                    total={totalResults}  // Total number of transactions
                    pageSize={pageSize}  // Number of items per page
                    showSizeChanger={false} // Disable changing page size
                    onChange={handlePageChange}  // Update page when user changes page
                />
            </div>

            {/* Modal for showing details */}
            <Modal
                title="Provider Details"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
            >
                {modalData && (
                    <div className="space-y-3">
                        {/* User Details */}
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Profile Image:</span>
                            <img className="w-16 h-16 rounded-full" src={modalData?.userId?.profileImage?.imageUrl.includes('amazonaws') ? modalData?.userId?.profileImage?.imageUrl : Url + modalData?.userId?.profileImage?.imageUrl} alt="Profile" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">User Name:</span>
                            <span>{modalData?.userId?.name || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Email:</span>
                            <span>{modalData?.userId?.email || "N/A"}</span>
                        </div>

                        {/* Transaction Details */}
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Amount:</span>
                            <span>৳{modalData?.amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Currency:</span>
                            <span>{modalData?.currency}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Payment Gateway:</span>
                            <span>{modalData?.paymentGateway}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Transaction ID:</span>
                            <span>{modalData?.transactionId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Payment Status:</span>
                            <span>{modalData?.paymentStatus}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Payment Intent:</span>
                            <span>{modalData?.paymentIntent}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TransactionHistory;
