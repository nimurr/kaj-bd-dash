import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";

const { Item } = Form;

const ProviderList = () => {
    // Demo data (simulating fetched data)
    const demoUserData = [
        { id: 1, fullName: "John Doe", accountID: "A123", email: "john.doe@example.com", phoneNumber: "123-456-7890", address_line1: "123 Main St", createdAt: "2023-06-10", status: "active", gender: "male", image: { url: "" } },
        { id: 2, fullName: "Jane Smith", accountID: "A124", email: "jane.smith@example.com", phoneNumber: "987-654-3210", address_line1: "456 Oak St", createdAt: "2023-06-05", status: "inactive", gender: "female", image: { url: "" } },
        { id: 3, fullName: "Bob Johnson", accountID: "A125", email: "bob.johnson@example.com", phoneNumber: "555-123-4567", address_line1: "789 Pine St", createdAt: "2023-06-15", status: "active", gender: "male", image: { url: "" } },
        { id: 4, fullName: "Alice Williams", accountID: "A126", email: "alice.williams@example.com", phoneNumber: "444-555-6789", address_line1: "101 Maple St", createdAt: "2023-05-25", status: "active", gender: "female", image: { url: "" } },
        { id: 5, fullName: "Charlie Brown", accountID: "A127", email: "charlie.brown@example.com", phoneNumber: "222-333-4444", address_line1: "202 Birch St", createdAt: "2023-04-18", status: "inactive", gender: "male", image: { url: "" } },
        { id: 6, fullName: "David White", accountID: "A128", email: "david.white@example.com", phoneNumber: "111-222-3333", address_line1: "303 Cedar St", createdAt: "2023-06-01", status: "active", gender: "male", image: { url: "" } },
        { id: 7, fullName: "Eva Green", accountID: "A129", email: "eva.green@example.com", phoneNumber: "999-888-7777", address_line1: "404 Elm St", createdAt: "2023-03-22", status: "inactive", gender: "female", image: { url: "" } },
        { id: 8, fullName: "Frank Harris", accountID: "A130", email: "frank.harris@example.com", phoneNumber: "333-444-5555", address_line1: "505 Birchwood St", createdAt: "2023-06-10", status: "active", gender: "male", image: { url: "" } },
    ];

    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState(demoUserData); // Initialize with demo data

    // User details visibility state
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [userDataFull, setUserDataFull] = useState(null); // Store full user data for the selected user

    // Search Filter
    useEffect(() => {
        if (searchText.trim() === "") {
            setDataSource(demoUserData); // Reset to all users
        } else {
            setDataSource(
                demoUserData.filter(
                    (user) =>
                        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                        String(user.phoneNumber).includes(searchText)
                )
            );
        }
    }, [searchText]);

    // Date Filter
    useEffect(() => {
        if (!selectedDate) {
            setDataSource(demoUserData); // Reset to all users if no date is selected
        } else {
            const formattedDate = selectedDate.format("YYYY-MM-DD");
            setDataSource(
                demoUserData.filter(
                    (user) => moment(user.createdAt).format("YYYY-MM-DD") === formattedDate
                )
            );
        }
    }, [selectedDate]);

    const handleShowDetails = (user) => {
        setUserDataFull(user); // Set the selected user details
        setDetailsVisible(true); // Show user details section
    };

    const columns = [
        { title: "#SI", dataIndex: "si", key: "si" },
        { title: "Full Name", dataIndex: "fullName", key: "fullName" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
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
                <Link to={"/"} className="text-2xl flex items-center">
                    <FaAngleLeft />  User list  {detailsVisible ? "Details" : ""}
                </Link>
                <Form layout="inline" className="flex space-x-4">
                    <button className="py-2 px-8 text-white  bg-[#778beb]">New Provider Request</button>
                    <Item name="date">
                        <DatePicker
                            className="rounded-md border border-[#778beb]"
                            onChange={(date) => setSelectedDate(date)}
                            placeholder="Select Date"
                        />
                    </Item>
                    <Item name="username">
                        <Input
                            className="rounded-md w-[70%] md:w-full border border-[#778beb]"
                            placeholder="User Name"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Item>
                    <Item>
                        <button className="size-8 rounded-full flex justify-center items-center bg-[#778beb] text-black">
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
                        scroll={{ x: "max-content" }}
                        responsive={true}
                        columns={columns}
                        dataSource={dataSource}
                        rowKey="id"
                        loading={false}
                    />
                </ConfigProvider>

                {/* User Details Section */}
                <div className={`${detailsVisible ? "block" : "hidden"} duration-500`}>
                    <div className=" w-full md:w-2/4 mx-auto border-2 border-[#39ceec] p-2 rounded-lg relative">

                        <div onClick={() => setDetailsVisible(false)} className="absolute bg-[#39ceec] p-3 rounded-full -top-5 -left-5 cursor-pointer" >
                            <FaArrowLeft className="text-2xl" />
                        </div>

                        {/* User Profile Section */}
                        <div className="flex items-center justify-between gap-5 mb-5">
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src="../../../public/logo/userimage.png"
                                    alt="User"
                                />
                                <h1 className="text-2xl font-semibold">{userDataFull?.fullName}</h1>
                            </div>

                        </div>

                        {/* User Details Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
                                <span className="font-semibold">Name</span>
                                <span>{userDataFull?.fullName}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
                                <span className="font-semibold">Email</span>
                                <span>{userDataFull?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
                                <span className="font-semibold">Status</span>
                                <span>{userDataFull?.status}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
                                <span className="font-semibold">Phone Number</span>
                                <span>{userDataFull?.phoneNumber}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
                                <span className="font-semibold">User Type</span>
                                <span>{userDataFull?.gender}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b-2 border-[#00000042]">
                                <span className="font-semibold">Joining Date</span>
                                <span>{moment(userDataFull?.createdAt).format("DD MMM YYYY")}</span>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        </section>
    );
};

export default ProviderList;
