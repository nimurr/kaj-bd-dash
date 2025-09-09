import { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
// Removed: import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";

const { Item } = Form;

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([]); // Store filtered data

  // Demo Users Data (Mocked Data for Testing)
  const allUsers = [
    { id: 1, fullName: "John Doe", accountID: "123", email: "john@example.com", phoneNumber: "123456789", address_line1: "123 Main St", createdAt: "2025-09-09T10:00:00Z", image: { url: "https://via.placeholder.com/150" }, status: "Active", gender: "Male" },
    { id: 2, fullName: "Jane Smith", accountID: "124", email: "jane@example.com", phoneNumber: "987654321", address_line1: "456 Elm St", createdAt: "2025-09-08T12:00:00Z", image: { url: "https://via.placeholder.com/150" }, status: "Inactive", gender: "Female" },
    { id: 3, fullName: "Alice Johnson", accountID: "125", email: "alice@example.com", phoneNumber: "456789123", address_line1: "789 Pine St", createdAt: "2025-09-07T09:00:00Z", image: { url: "https://via.placeholder.com/150" }, status: "Active", gender: "Female" },
    { id: 4, fullName: "Bob Brown", accountID: "126", email: "bob@example.com", phoneNumber: "321654987", address_line1: "101 Maple St", createdAt: "2025-09-06T15:30:00Z", image: { url: "https://via.placeholder.com/150" }, status: "Active", gender: "Male" },
    { id: 5, fullName: "Charlie Green", accountID: "127", email: "charlie@example.com", phoneNumber: "159753468", address_line1: "202 Oak St", createdAt: "2025-09-05T10:45:00Z", image: { url: "https://via.placeholder.com/150" }, status: "Inactive", gender: "Male" },
    // Add more demo users as needed
  ];

  // Update `dataSource` when `allUsers` is available
  useEffect(() => {
    const formattedUsers = allUsers.map((user, index) => ({
      id: user.id, // Ensure ID exists
      si: index + 1,
      fullName: user.fullName,
      accountID: user.accountID,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address_line1: user.address_line1,
      createdAt: user.createdAt,
      imageUrl: user.image?.url,
      status: user.status,
      gender: user.gender,
    }));
    setDataSource(formattedUsers);
  }, []);

  // Search Filter
  useEffect(() => {
    if (searchText.trim() === "") {
      setDataSource(allUsers || []);
    } else {
      setDataSource(
        allUsers?.filter(
          (user) =>
            user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            String(user.phoneNumber)?.includes(searchText)
        ) || []
      );
    }
  }, [searchText]);

  // Date Filter
  useEffect(() => {
    if (!selectedDate) {
      setDataSource(allUsers || []);
    } else {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      setDataSource(
        allUsers?.filter((user) => moment(user.createdAt).format("YYYY-MM-DD") === formattedDate) || []
      );
    }
  }, [selectedDate]);

  const columns = [
    {
      title: "#SI", dataIndex: "si", key: "si",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      }
    },
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
        <Link to={`/users/${record.id}`}>
          <GoInfo className="text-2xl" />
        </Link>
      ),
    },
  ];

  return (
    <section>
      <div className="md:flex justify-between items-center py-6 mb-4">
        <Link to={"/collaborator"} className="text-2xl flex items-center">
          <FaAngleLeft /> Collaborator List
        </Link>
        <Form layout="inline" className="flex space-x-4">
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
          loading={false} // Since we are using mock data, we can set this to false
        />
      </ConfigProvider>
    </section>
  );
};

export default Users;