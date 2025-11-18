import React, { useState, useEffect } from 'react';
import { Table, Select, Button, Modal, ConfigProvider, Form, DatePicker, Input, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FaArrowLeft } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { useApproveAndRejectMutation, useGetWithdrawalQuery } from '../../redux/features/withdrawal/withdrawal';
import Url from '../../redux/baseApi/forImageUrl';
import Item from 'antd/es/list/Item';

const { Option } = Select;

// Define columns for the table
const WithdrawalRequest = () => {
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const [modalData, setModalData] = useState(null); // Data to display in the modal
    const [searchText, setSearchText] = useState(""); // Search text
    const [selectedDate, setSelectedDate] = useState([null, null]); // Store fromDate and toDate
    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState('3222-12-31');
    const [status, setStatus] = useState('rejected');
    const { data: withdrawalData, refetch } = useGetWithdrawalQuery({ from: fromDate, to: toDate, status });
    const fullwithdrawalData = withdrawalData?.data?.attributes?.results;

    // Update data based on search text and selected date range
    const [dataSource, setDataSource] = useState(fullwithdrawalData); // Initialize with full withdrawal data

    useEffect(() => {
        if (!fullwithdrawalData) return;

        let filteredData = fullwithdrawalData;

        // Apply search filter
        if (searchText.trim() !== "") {
            filteredData = filteredData.filter(
                (request) =>
                    request.userId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                    request.bankName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    String(request.requestedAmount).includes(searchText)
            );
        }

        // Apply date filter
        if (selectedDate[0] && selectedDate[1]) {
            const from = selectedDate[0].startOf("day").toISOString();
            const to = selectedDate[1].endOf("day").toISOString();

            filteredData = filteredData.filter(
                (request) => moment(request.requestedAt).isBetween(from, to, null, '[]')
            );
        }

        setDataSource(filteredData);
    }, [searchText, selectedDate, fullwithdrawalData]);

    // Define the handleShowDetails function
    const handleShowDetails = (record) => {
        setModalData(record); // Set the selected record data
        setIsModalVisible(true); // Show the modal
    };

    const handleCloseModal = () => {
        setIsModalVisible(false); // Close the modal
        setModalData(null); // Clear modal data
    };

    const columns = [
        {
            title: 'Provider Name',
            dataIndex: 'userId',
            key: 'userId',
            render: (s) => <span>{s?.name}</span>
        },
        {
            title: 'Bank Name',
            dataIndex: 'bankName',
            key: 'bankName',
        },
        {
            title: 'A/C Number',
            dataIndex: 'bankAccountNumber',
            key: 'bankAccountNumber',
        },
        {
            title: 'Withdraw Amount',
            dataIndex: 'requestedAmount',
            key: 'requestedAmount',
        },
        {
            title: 'Request Date',
            dataIndex: 'requestedAt',
            key: 'requestedAt',
            render: (s) => <span>{moment(s).format("DD MMM YYYY")}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s) => <span className={`capitalize ${s === "rejected" ? "text-yellow-500" : "text-green-600"}`}>{s}</span>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        icon={<EyeOutlined className='text-2xl' />}
                        onClick={() => handleShowDetails(record)} // Correct function call
                    >
                    </Button>
                </div>
            ),
        },
    ];

    const [proof, setProof] = useState(null);
    const handleUploadProof = (e) => {
        // Handle upload proof logic
        const file = e.target.files[0];
        setProof(file);
    };

    const [acceptAndReject] = useApproveAndRejectMutation();
    console.log(modalData)

    const handleApprove = async () => {

        if (!proof) return message.error("Please upload proof of payment.");
        const formData = new FormData();
        formData.append("proofOfPayment", proof);
        formData.append("status", "accept");

        try {

            const res = await acceptAndReject({ id: modalData._WithdrawalRequstId, data: formData });
            console.log(res);
            if (res?.error) {
                message.error(res?.error?.data?.message);
            }
            if (res?.data) {
                message.success(res?.data?.message);
                handleCloseModal();
                refetch();
                setProof(null);
            }

        } catch (error) {

        }

    };

    const handleReject = async () => {

        if (!proof) return message.error("Please upload proof of payment.");
        const formData = new FormData();
        formData.append("proofOfPayment", proof);
        formData.append("status", "reject");

        try {

            const res = await acceptAndReject({ id: modalData._WithdrawalRequstId, data: formData });
            console.log(res);
            if (res?.error) {
                message.error(res?.error?.data?.message);
            }
            if (res?.data) {
                message.success(res?.data?.message);
                handleCloseModal();
                refetch();
                setProof(null);
            }

        } catch (error) {
            message.error("Something went wrong");
        }

    };



    return (
        <div className="p-5">
            <div>
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-2xl font-semibold mb-4">Withdrawal Requests</h1>
                    {/* Filter by Period */}
                    <div className="mb-4 flex items-center flex-wrap">
                        <Form layout="inline" className="flex space-x-2 gap-2 flex-wrap">
                            <Item name="fromDate">
                                <DatePicker
                                    className="rounded-md border border-[#778beb]"
                                    onChange={(date) => setSelectedDate([date, selectedDate[1]])}
                                    placeholder="From Date"
                                />
                            </Item>
                            <Item name="toDate">
                                <DatePicker
                                    className="rounded-md border border-[#778beb]"
                                    onChange={(date) => setSelectedDate([selectedDate[0], date])}
                                    placeholder="To Date"
                                />
                            </Item>
                            <div>
                                <select className='py-1 px-5 rounded border border-[#778beb]' onChange={(e) => setStatus(e.target.value)} name="status" id="">
                                    <option value="rejected">Rejected</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </Form>
                    </div>
                </div>

                <div>
                    {/* Table */}
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
                            pagination={false}
                            rowKey="key"
                        />
                    </ConfigProvider>
                </div>
            </div>

            {/* Modal for showing details */}
            <Modal
                title="Provider Details"
                visible={isModalVisible} // Control visibility based on state
                onCancel={handleCloseModal} // Close the modal
                footer={null} // Remove footer buttons
                width={600} // Set modal width
            >
                {modalData && (
                    <div className="w-full border-2 border-[#778beb] p-2 rounded-lg relative">
                        {/* Provider Profile Section */}
                        <div className="flex items-center justify-between flex-wrap gap-5 mb-5">
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src={modalData?.userId?.profileImage?.imageUrl?.includes('amazonaws') ? modalData?.userId?.profileImage.imageUrl : Url + modalData?.userId?.profileImage?.imageUrl}
                                    alt="Provider"
                                />
                                <h1 className="text-2xl font-semibold">{modalData?.userId?.name || "N/A"}</h1>
                            </div>
                            <div className='flex items-center gap-3'>
                                <button onClick={handleApprove} className='py-3 px-8 bg-[#778beb] text-white rounded-lg'>Approve</button>
                                <button onClick={handleReject} className='py-3 px-8 border border-[#778beb] text-[#778beb] rounded-lg'>Reject</button>
                            </div>
                        </div>

                        {/* Provider Details Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Name</span>
                                <span>{modalData?.userId?.name || "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Email</span>
                                <span>{modalData?.userId?.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Bank Name</span>
                                <span>{modalData?.bankName || "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">A/C Number</span>
                                <span>{modalData?.bankAccountNumber || "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Requested Date</span>
                                <span>{moment(modalData?.requestedAt).format("DD MMM YYYY") || "N/A"}</span>
                            </div>

                            {/* Proof of Payment Section */}
                            <div className=" py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold block">Other Documents</span>
                                <div>
                                    <span>Proof Of Payment </span>
                                    <img className="w-full mt-1" src={modalData?.proofOfPayment[0]?.attachment?.includes('amazonaws') ? modalData?.proofOfPayment[0]?.attachment : Url + modalData?.proofOfPayment[0]?.attachment} alt="" />
                                </div>
                            </div>
                            <div>
                                <span className="font-semibold block mb-2">Proof Of Payment</span>
                                <input onChange={handleUploadProof} type="file" name="proofOfPayment" id="" />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WithdrawalRequest;
