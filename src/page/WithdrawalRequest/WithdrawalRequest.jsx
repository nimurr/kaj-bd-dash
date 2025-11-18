import React, { useState } from 'react';
import { Table, Select, Button, Modal, ConfigProvider, Form, DatePicker, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FaArrowLeft } from 'react-icons/fa';
import Item from 'antd/es/list/Item';
import { IoIosSearch } from 'react-icons/io';
import { useGetWithdrawalQuery } from '../../redux/features/withdrawal/withdrawal';

const { Option } = Select;

// Sample data for the table
const data = [
    {
        key: '1',
        providerName: 'Imran Khan',
        bankName: 'ABC Bank',
        accountNumber: '2131135313131313',
        withdrawAmount: 150,
        requestDate: '2025-09-12',
        status: 'Pending',
        userImage: 'https://via.placeholder.com/150', // Sample image URL
        email: 'support@gmail.com',
        phoneNumber: '12333333333',
        address: 'Rangpur Bangladesh',
    },
    {
        key: '2',
        providerName: 'Ali Ahmed',
        bankName: 'XYZ Bank',
        accountNumber: '987654321',
        withdrawAmount: 3000,
        requestDate: '2025-06-12',
        status: 'Completed',
        userImage: 'https://via.placeholder.com/150', // Sample image URL
        email: 'ali.ahmed@gmail.com',
        phoneNumber: '987654321',
        address: 'Dhaka, Bangladesh',
    },
    // More records as needed
];

// Define columns for the table
const WithdrawalRequest = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [filteredData, setFilteredData] = useState(data); // Store filtered data
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const [modalData, setModalData] = useState(null); // Data to display in the modal

    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState([null, null]);  // Store fromDate and toDate

    const handleFilterChange = (value) => {
        setSelectedFilter(value);
        filterData(value);
    };

    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState('3222-12-31');
    const [status, setStatus] = useState('rejected');

    const { data: withdrawalData } = useGetWithdrawalQuery({ from: fromDate, to: toDate, status });
    const fullwithdrawalData = withdrawalData?.data?.attributes?.results;
    console.log(fullwithdrawalData)


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
            dataIndex: 'providerName',
            key: 'providerName',
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
            render: (s) => <span className={`capitalize ${s == "Pending" ? "text-yellow-500" : "text-green-600"} `}>{s}</span>
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
                            dataSource={fullwithdrawalData}
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
                        <div className="flex items-center justify-between gap-5 mb-5">
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src="../../../public/logo/userimage.png"  // Placeholder image
                                    alt="Provider"
                                />
                                <h1 className="text-2xl font-semibold">Imran Khan</h1>
                            </div>
                        </div>

                        {/* Provider Details Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Name</span>
                                <span>Imran Khan</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Work Type</span>
                                <span>AC-repair</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Years of Experience</span>
                                <span>4 Years</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Email</span>
                                <span>Support@gmail.com</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Phone Number</span>
                                <span>1233333333</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Gender</span>
                                <span>Male</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Date of Birth</span>
                                <span>11-11-1999</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Address</span>
                                <span>Rangpur Bangladesh</span>
                            </div>
                            <div className=" py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold block">Other Documents</span>
                                <div>
                                    <span>NID/Driving License/Passport (Font Side) Image </span>
                                    <img className="w-full mt-1" src="https://imgv2-1-f.scribdassets.com/img/document/658369930/original/352985ad62/1?v=1" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WithdrawalRequest;