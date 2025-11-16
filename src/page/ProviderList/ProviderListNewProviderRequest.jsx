import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import Url from "../../redux/baseApi/forImageUrl.js";
import { useGetAllNewProvidersListQuery } from "../../redux/features/providers/providers.js";

const { Item } = Form;

const ProviderListNewProviderRequest = () => {
    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState('2222-12-31');
    const [searchData, setSearchData] = useState('');

    const { data, isLoading } = useGetAllNewProvidersListQuery({ from: fromDate, to: toDate, searchData });
    const fullUserData = data?.data?.attributes?.results;
    console.log(fullUserData)

    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState([null, null]);  // Store fromDate and toDate
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState(fullUserData); // Initialize with full user data

    // User details visibility state
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [userDataFull, setUserDataFull] = useState(null); // Store full user data for the selected user

    // Filter users based on search text and date range
    useEffect(() => {
        if (!fullUserData) return;

        let filteredData = fullUserData;

        // Apply search filter
        if (searchText.trim() !== "") {
            filteredData = filteredData.filter(
                (user) =>
                    user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                    String(user.phoneNumber).includes(searchText)
            );
        }

        // Apply date filter
        if (selectedDate[0] && selectedDate[1]) {
            const from = selectedDate[0].startOf("day").toISOString();
            const to = selectedDate[1].endOf("day").toISOString();

            filteredData = filteredData.filter(
                (user) => moment(user.createdAt).isBetween(from, to, null, '[]')
            );
        }

        setDataSource(filteredData);
    }, [searchText, selectedDate, fullUserData]);

    const handleShowDetails = (user) => {
        setUserDataFull(user); // Set the selected user details
        setDetailsVisible(true); // Show user details section
    };

    const columns = [
        { title: "#SI", dataIndex: "si", key: "si", render: (text, record, index) => index + 1 },
        { title: "Full Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        // { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Gender", dataIndex: "gender", key: "gender" },
        { title: "Role", dataIndex: "role", key: "role" },
        {
            title: "Joined Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => moment(date).format("DD MMM YYYY"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div onClick={() => handleShowDetails(record)} className="cursor-pointer">
                    <IoEyeOutline className="text-2xl" />
                </div>
            ),
        },
    ];

    return (
        <section>
            <div className="md:flex justify-between items-center space-y-2 py-6 mb-4">
                <Link to={"/provider-list"} className="text-2xl flex items-center ">
                    <FaAngleLeft />New Provider list  {detailsVisible ? "Details" : ""}
                </Link>
                <Form layout="inline" className="flex space-x-2">
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
                    <Item name="username">
                        <Input
                            className="rounded-md w-[70%] md:w-full border border-[#778beb]"
                            placeholder="Search by Name, Email, or Phone"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Item>
                    <Item>
                        <button className="size-8 rounded-full flex justify-center items-center bg-[#778beb] text-white">
                            <IoIosSearch className="size-5" />
                        </button>
                    </Item>
                </Form>
            </div>

            <div className={`${detailsVisible ? "grid lg:grid-cols-2 gap-5" : "block"} duration-500`}>
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
                        pagination={{
                            position: ["bottomCenter"],
                            current: currentPage,
                            onChange: setCurrentPage,
                        }}
                        loading={isLoading}
                        scroll={{ x: "max-content" }}
                        responsive={true}
                        columns={columns}
                        dataSource={dataSource}
                        rowKey="id"
                    />
                </ConfigProvider>

                {/* Provider Details Section */}
                <div className={`${detailsVisible ? "block" : "hidden"} duration-500`}>
                    <div className="w-full md:w-3/4 mx-auto border-2 border-[#778beb] p-2 rounded-lg relative">
                        <div onClick={() => setDetailsVisible(false)} className="absolute bg-[#778beb] p-3 rounded-full -top-5 -left-5 cursor-pointer">
                            <FaArrowLeft className="text-xl text-yellow-50" />
                        </div>
                        {/* Provider Profile Section */}
                        <div className="flex items-center justify-between gap-5 mb-5">
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src={userDataFull?.profileImage?.imageUrl.includes('amazonaws') ? userDataFull?.profileImage?.imageUrl : Url + userDataFull?.profileImage?.imageUrl}
                                    alt="Provider"
                                />
                                <h1 className="text-2xl font-semibold">{userDataFull?.name}</h1>
                            </div>
                        </div>
                        {/* Provider Details Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Name</span>
                                <span>{userDataFull?.name}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Email</span>
                                <span>{userDataFull?.email}</span>
                            </div>
                            {/* <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Phone Number</span>
                                <span>{userDataFull?.phoneNumber}</span>
                            </div> */}
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Role</span>
                                <span>{userDataFull?.role}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Created Date</span>
                                <span>{moment(userDataFull?.createdAt).format("YYYY-MM-DD")}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded-lg border-[#ccc]">
                                <span className="font-semibold">Gender</span>
                                <span>{userDataFull?.gender}</span>
                            </div>
                            <div className='my-5'>
                                <h2 className="text-2xl font-semibold mb-3" >FrontSide Certificate Image</h2>
                                <img className="w-full" src={userDataFull?.frontSideCertificateImage[0].includes('amazonaws') ? userDataFull?.frontSideCertificateImage[0] : Url + userDataFull?.frontSideCertificateImage[0]} alt="" />
                            </div>
                            <div className=''>
                                <h2 className="text-2xl font-semibold mb-3" >BackSide Certificate Image</h2>
                                <img className="w-full" src={userDataFull?.backSideCertificateImage[0].includes('amazonaws') ? userDataFull?.backSideCertificateImage[0] : Url + userDataFull?.backSideCertificateImage[0]} alt="" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProviderListNewProviderRequest;