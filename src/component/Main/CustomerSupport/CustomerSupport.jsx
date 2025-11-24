import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

const { Item } = Form;

const demoUserData = [
    {
        id: "1",
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
        gender: "Male",
        createdAt: "2023-05-15T10:20:30Z",
        role: "Customer",
        profileImage: {
            imageUrl: "https://www.w3schools.com/w3images/avatar2.png",
        },
        messageTitle: "Support Request",
        message: "I need help with my account Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "janesmith@example.com",
        phoneNumber: "0987654321",
        gender: "Female",
        createdAt: "2023-06-10T15:45:00Z",
        role: "Support Agent",
        profileImage: {
            imageUrl: "https://www.w3schools.com/w3images/avatar6.png",
        },
        messageTitle: "Support Request",
        message: "I need help with my account Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    // Add more users as necessary for demo
];

const CustomerSupport = () => {
    const [fromDate, setFromDate] = useState("2024-01-01");
    const [toDate, setToDate] = useState("3222-12-31");
    const [searchData, setSearchData] = useState("");

    const fullUserData = demoUserData; // Using static demo data

    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState(fullUserData);

    // User details visibility state
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [userDataFull, setUserDataFull] = useState(null);

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
                (user) => moment(user.createdAt).isBetween(from, to, null, "[]")
            );
        }

        setDataSource(filteredData);
    }, [searchText, selectedDate, fullUserData]);

    const handleShowDetails = (user) => {
        setUserDataFull(user);
        setDetailsVisible(true);
    };

    const columns = [
        { title: "#SI", dataIndex: "si", key: "si", render: (text, record, index) => index + 1 },
        { title: "Full Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Gender", dataIndex: "gender", key: "gender" },
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
                        <div className="flex items-center justify-between gap-5 mb-5">
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src={userDataFull?.profileImage?.imageUrl}
                                    alt="Provider"
                                />
                                <h1 className="text-2xl font-semibold">{userDataFull?.name}</h1>
                            </div>
                        </div>
                        {/* Provider Details Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded border-[#f1f1f1]">
                                <span className="font-semibold">Name</span>
                                <span>{userDataFull?.name}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded border-[#f1f1f1]">
                                <span className="font-semibold">Email</span>
                                <span>{userDataFull?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-2 p-2 rounded border-[#f1f1f1]">
                                <span className="font-semibold">Phone</span>
                                <span>{userDataFull?.phoneNumber}</span>
                            </div>

                            <div className="py-3 border-2 p-2 rounded-lg border-[#f1f1f1]">
                                <h2 className="font-semibold mb-2 ">{userDataFull?.messageTitle}</h2>
                                <p>{userDataFull?.message}</p>
                                <img className="border mt-2 rounded-lg" src="https://raw.githubusercontent.com/arifpro/sslcommerz-mern-example/main/screenshots/PaymentPage2.png" alt="" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerSupport;
