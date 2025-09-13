

import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";

const { Item } = Form;

const ProviderListNewProviderRequest = () => {
    // Demo data (simulating fetched data)
    const demoUserData = [
        { id: 1, fullName: "John Doe", accountID: "A123", email: "john.doe@example.com", phoneNumber: "123-456-7890", address_line1: "123 Main St", createdAt: "2023-06-10", status: "active", gender: "male", image: { url: "" }, status: "Active" },
        { id: 2, fullName: "Jane Smith", accountID: "A124", email: "jane.smith@example.com", phoneNumber: "987-654-3210", address_line1: "456 Oak St", createdAt: "2023-06-05", status: "inactive", gender: "female", image: { url: "" }, status: "Active" },
        { id: 3, fullName: "Bob Johnson", accountID: "A125", email: "bob.johnson@example.com", phoneNumber: "555-123-4567", address_line1: "789 Pine St", createdAt: "2023-06-15", status: "active", gender: "male", image: { url: "" }, status: "Active" },
        { id: 4, fullName: "Alice Williams", accountID: "A126", email: "alice.williams@example.com", phoneNumber: "444-555-6789", address_line1: "101 Maple St", createdAt: "2023-05-25", status: "active", gender: "female", image: { url: "" }, status: "Active" },
        { id: 5, fullName: "Charlie Brown", accountID: "A127", email: "charlie.brown@example.com", phoneNumber: "222-333-4444", address_line1: "202 Birch St", createdAt: "2023-04-18", status: "inactive", gender: "male", image: { url: "" }, status: "Active" },
        { id: 6, fullName: "David White", accountID: "A128", email: "david.white@example.com", phoneNumber: "111-222-3333", address_line1: "303 Cedar St", createdAt: "2023-06-01", status: "active", gender: "male", image: { url: "" }, status: "Active" },
        { id: 7, fullName: "Eva Green", accountID: "A129", email: "eva.green@example.com", phoneNumber: "999-888-7777", address_line1: "404 Elm St", createdAt: "2023-03-22", status: "inactive", gender: "female", image: { url: "" }, status: "Active" },
        { id: 8, fullName: "Frank Harris", accountID: "A130", email: "frank.harris@example.com", phoneNumber: "333-444-5555", address_line1: "505 Birchwood St", createdAt: "2023-06-10", status: "active", gender: "male", image: { url: "" }, status: "Active" },
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
                <Link to={"/provider-list"} className="text-2xl flex items-center ">
                    <FaAngleLeft />  New Provider Request  {detailsVisible ? "Details" : ""}
                </Link>
                <Form layout="inline" className="flex space-x-4">
                    {/* <Link to={'/provider-list/new-provider-request'} className="py-2 px-8 text-white rounded-lg bg-[#778beb]">New Provider Request</Link> */}
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

                {/* Provider Details Section */}
                <div className={`${detailsVisible ? "block" : "hidden"} duration-500`}>
                    <div className="w-full md:w-3/4 mx-auto border-2 border-[#778beb] p-2 rounded-lg relative">

                        <div onClick={() => setDetailsVisible(false)} className="absolute bg-[#778beb] p-3 rounded-full -top-5 -left-5 cursor-pointer">
                            <FaArrowLeft className="text-xl text-yellow-50" />
                        </div>

                        {/* Provider Profile Section */}
                        <div className="flex items-center flex-wrap justify-between gap-5 mb-5">
                            <div className="flex items-center gap-5">
                                <img
                                    className="w-24 h-24 rounded-full"
                                    src="../../../public/logo/userimage.png"  // Placeholder image
                                    alt="Provider"
                                />
                                <h1 className="text-2xl font-semibold">Imran Khan</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="bg-[#778beb] text-white p-2 rounded-lg">Accept</button>
                                <button className="border-[#778beb] border p-2 rounded-lg">Reject</button>
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

                                <div>
                                    <span>NID/Driving License/Passport (Back Side) Image</span>
                                    <img className="w-full mt-1" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/NID_%28Back%29.png/250px-NID_%28Back%29.png" alt="" />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default ProviderListNewProviderRequest;
