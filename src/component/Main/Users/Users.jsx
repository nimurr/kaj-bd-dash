import { useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";
import Url from "../../../redux/baseApi/forImageUrl";

const { Item } = Form;

const Users = () => {
  // ================= STATES =================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState([null, null]);

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [userDataFull, setUserDataFull] = useState(null);

  // ================= API CALL =================
  const { data, isLoading } = useGetAllUsersQuery({
    page,
    limit,
    searchData: searchText,
    from: selectedDate[0]
      ? selectedDate[0].startOf("day").toISOString()
      : "2024-01-01",
    to: selectedDate[1]
      ? selectedDate[1].endOf("day").toISOString()
      : "3222-12-31",
  });

  // ================= DATA =================
  const users = data?.data?.attributes?.results || [];
  const paginationData = data?.data?.attributes;

  // ================= HANDLERS =================
  const handleShowDetails = (user) => {
    setUserDataFull(user);
    setDetailsVisible(true);
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "#SI",
      render: (_, __, index) => (paginationData?.page - 1) * limit + index + 1,
    },
    { title: "Full Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone Number", dataIndex: "phoneNumber" },
    { title: "Gender", dataIndex: "gender" },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div
          onClick={() => handleShowDetails(record)}
          className="cursor-pointer"
        >
          <IoEyeOutline className="text-2xl" />
        </div>
      ),
    },
  ];

  // ================= JSX =================
  return (
    <section>
      {/* HEADER */}
      <div className="md:flex justify-between items-center py-6 mb-4">
        <Link to="/" className="text-2xl flex items-center">
          <FaAngleLeft />
          <span className="ml-2">
            Users list {detailsVisible ? "Details" : ""}
          </span>
        </Link>

        {/* FILTERS */}
        <Form layout="inline" className="flex space-x-2">
          <Item>
            <DatePicker
              className="rounded-md border border-[#778beb]"
              placeholder="From Date"
              onChange={(date) =>
                setSelectedDate([date, selectedDate[1]])
              }
            />
          </Item>

          <Item>
            <DatePicker
              className="rounded-md border border-[#778beb]"
              placeholder="To Date"
              onChange={(date) =>
                setSelectedDate([selectedDate[0], date])
              }
            />
          </Item>

          <Item>
            <Input
              className="rounded-md w-[70%] md:w-full border border-[#778beb]"
              placeholder="Search by Name "
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
            />
          </Item>

          <Item>
            <button
              type="button"
              className="size-8 rounded-full flex justify-center items-center bg-[#778beb] text-white"
            >
              <IoIosSearch className="size-5" />
            </button>
          </Item>
        </Form>
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`${
          detailsVisible ? "grid lg:grid-cols-2 gap-5" : "block"
        } duration-500`}
      >
        {/* TABLE */}
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
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={users}
            scroll={{ x: "max-content" }}
            pagination={{
              current: paginationData?.page,
              pageSize: paginationData?.limit,
              total: paginationData?.totalResults,
              position: ["bottomCenter"],
              onChange: (page) => setPage(page),
            }}
          />
        </ConfigProvider>

        {/* USER DETAILS */}
        <div className={`${detailsVisible ? "block" : "hidden"} duration-500`}>
          <div className="w-full md:w-3/4 mx-auto border-2 border-[#778beb] p-2 rounded-lg relative">
            <div
              onClick={() => setDetailsVisible(false)}
              className="absolute bg-[#778beb] p-3 rounded-full -top-5 -left-5 cursor-pointer"
            >
              <FaArrowLeft className="text-xl text-yellow-50" />
            </div>

            {/* PROFILE */}
            <div className="flex items-center gap-5 mb-5">
              <img
                className="w-24 h-24 rounded-full"
                src={
                  userDataFull?.profileImage?.imageUrl?.includes("amazonaws")
                    ? userDataFull?.profileImage?.imageUrl
                    : Url + userDataFull?.profileImage?.imageUrl
                }
                alt="User"
              />
              <h1 className="text-2xl font-semibold">
                {userDataFull?.name}
              </h1>
            </div>

            {/* DETAILS */}
            <div className="space-y-3">
              {[
                ["Name", userDataFull?.name],
                ["Email", userDataFull?.email],
                ["Phone", userDataFull?.phoneNumber],
                ["Role", userDataFull?.role],
                ["Gender", userDataFull?.gender],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-3 border-2 p-2 rounded-lg"
                >
                  <span className="font-semibold">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Users;
