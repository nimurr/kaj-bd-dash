import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { useGetAlluserSupportQuery } from "../../../redux/features/userSupport/userSupport";
import Url from "../../../redux/baseApi/forImageUrl";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const { Item } = Form;


const CustomerSupport = () => {
    const [fromDate, setFromDate] = useState("2024-01-01");
    const [toDate, setToDate] = useState("3222-12-31");
    const [searchData, setSearchData] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useGetAlluserSupportQuery({ page, limit });
    const fullData = data?.data?.attributes?.results;
    const paginatePage = data?.data?.attributes?.totalPages;
    console.log(fullData, paginatePage)


    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState(fullData);

    // User details visibility state
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [userDataFull, setUserDataFull] = useState(null);

    useEffect(() => {
        if (!fullData) return;

        let filteredData = fullData;

        // Apply search filter
        if (searchText.trim() !== "") {
            filteredData = filteredData?.filter(
                (user) =>
                    user?.creatorId.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                    String(user.phoneNumber).includes(searchText)
            );
        }

        // Apply date filter
        if (selectedDate[0] && selectedDate[1]) {
            const from = selectedDate[0].startOf("day").toISOString();
            const to = selectedDate[1].endOf("day").toISOString();

            filteredData = filteredData.filter(
                (user) => moment(user.createdAt).isBetween(from, to, null, "[]")
            );
        }

        setDataSource(filteredData);
    }, [searchText, selectedDate, fullData]);

    const handleShowDetails = (user) => {
        setUserDataFull(user);
        setDetailsVisible(true);
    };

    const columns = [
        { title: "#SI", dataIndex: "si", key: "si", render: (text, record, index) => index + 1 },
        { title: "Full Name", dataIndex: "name", key: "name", render: (text, record) => record.creatorId.name },
        { title: "Email", dataIndex: "email", key: "email", render: (text, record) => record.creatorId.email },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber", render: (text, record) => record.creatorId.phoneNumber },
        { title: "Role", dataIndex: "role", key: "role", render: (text, record) => record.creatorId.role },
        {
            title: "Read Status", dataIndex: "role", key: "role",
            render: (text, record) => record.isResolved ? <span className="text-green-600">Completed</span> : <span className="text-yellow-600">Progressing </span>
        },
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
            <div className="md:flex justify-between items-center py-6 mb-4">
                <Link to={"/"} className="text-2xl flex items-center ">
                    All Customer Reports {detailsVisible ? "Details" : ""}
                </Link>

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
                            position: ["bottomRight"],
                            current: currentPage,
                            onChange: setCurrentPage,
                        }}
                        loading={false}
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
                        <div className="flex items-center justify-between flex-wrap gap-5 mb-5">
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src={userDataFull?.creatorId?.profileImage?.imageUrl.includes("amazonaws") ? userDataFull?.creatorId?.profileImage?.imageUrl : Url + userDataFull?.creatorId?.profileImage?.imageUrl}
                                    alt="Provider"
                                />
                                <h1 className="text-2xl font-semibold">{userDataFull?.creatorId?.name}</h1>
                            </div>
                            <div>
                                <button className="py-2 px-8 bg-[#778beb] text-white rounded hover:bg-[#778beb]">Complete</button>
                            </div>
                        </div>
                        {/* Provider Details Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded border-[#f1f1f1]">
                                <span className="font-semibold">Name</span>
                                <span>{userDataFull?.creatorId?.name}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded border-[#f1f1f1]">
                                <span className="font-semibold">Email</span>
                                <span>{userDataFull?.creatorId?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded border-[#f1f1f1]">
                                <span className="font-semibold">Phone</span>
                                <span>{userDataFull?.creatorId?.phoneNumber}</span>
                            </div>

                            <div className="py-3 border-2 p-2 rounded-lg border-[#f1f1f1]">
                                <p className="mb-3 text-gray-500"><span className="font-semibold text-black">Message:</span> {userDataFull?.supportMessage}</p>
                                <img className="border  rounded-lg" src={userDataFull?.attachments[0]?.attachment.includes("amazonaws") ? userDataFull?.attachments[0]?.attachment : Url + userDataFull?.attachments[0]?.attachment} alt="" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerSupport;
