import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ConfigProvider, Form, DatePicker, message, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import Url from '../../redux/baseApi/forImageUrl';
import { useGetPaymentTransactionsHistoryQuery } from '../../redux/features/earnings/earningsApi';

const TransactionHistory = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState([null, null]);
    const [status, setStatus] = useState('rejected');

    // API call to fetch transaction history
    const { data: withdrawalData, refetch } = useGetPaymentTransactionsHistoryQuery();
    const fullwithdrawalData = withdrawalData?.attributes?.results || [];

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

    // const [acceptAndReject] = useApproveAndRejectMutation();

    const handleApprove = async () => {
        const formData = new FormData();
        formData.append("status", "accept");
        try {
            const res = await acceptAndReject({ id: modalData._WithdrawalRequstId, data: formData });
            if (res?.data) {
                message.success(res?.data?.message);
                handleCloseModal();
                refetch();
            }
        } catch (error) {
            message.error("Failed to approve");
        }
    };

    const handleReject = async () => {
        const formData = new FormData();
        formData.append("status", "reject");
        try {
            const res = await acceptAndReject({ id: modalData._WithdrawalRequstId, data: formData });
            if (res?.data) {
                message.success(res?.data?.message);
                handleCloseModal();
                refetch();
            }
        } catch (error) {
            message.error("Failed to reject");
        }
    };

    // Filter data based on searchText and date range
    const filteredData = fullwithdrawalData.filter((request) => {
        let isValid = true;

        // Search filter
        if (searchText) {
            isValid = isValid && (
                request._paymentTransactionId?.toLowerCase().includes(searchText.toLowerCase()) ||
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
            <div className="flex items-center justify-between gap-5">
                <h1 className="text-2xl font-semibold mb-4">Transactions History</h1>
                {/* Filter by Period */}
                <Form className="flex items-center gap-5">
                    <Input
                        className="py-1 inline px-5 min-w-[250px] rounded border border-[#778beb]"
                        placeholder="Search by Provider, Bank, Amount"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <select
                        className="py-1 px-5 rounded border border-[#778beb]"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </Form>
            </div>

            {/* Transaction History Table */}
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
                    rowKey="_paymentTransactionId"
                />
            </ConfigProvider>

            {/* Modal for showing details */}
            <Modal
                title="Provider Details"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
            >
                {modalData && (
                    <div>
                        hi
                    </div>
                )}

            </Modal>
        </div>
    );
};

export default TransactionHistory;
