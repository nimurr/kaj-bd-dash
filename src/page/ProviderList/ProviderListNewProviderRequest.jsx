import { useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import Url from "../../redux/baseApi/forImageUrl.js";
import {
  useAcceptAndRejectProviderMutation,
  useGetAllNewProvidersListQuery,
} from "../../redux/features/providers/providers.js";
import { toast, Toaster } from "sonner";

const { Item } = Form;

const ProviderListNewProviderRequest = () => {
  // ================= STATE =================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState([null, null]);

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [userDataFull, setUserDataFull] = useState(null);

  // ================= API =================
  const { data, isLoading, refetch } =
    useGetAllNewProvidersListQuery({
      page,
      limit,
      // searchData: searchText,
      from: selectedDate[0]
        ? selectedDate[0].startOf("day").toISOString()
        : "2024-01-01",
      to: selectedDate[1]
        ? selectedDate[1].endOf("day").toISOString()
        : "2222-12-31",
    });

  const [approveStatusChange] =
    useAcceptAndRejectProviderMutation();

  // ================= DATA =================
  const providers = data?.data?.attributes?.results || [];
  const pagination = data?.data?.attributes;

  // ================= HANDLERS =================
  const handleShowDetails = (user) => {
    setUserDataFull(user);
    setDetailsVisible(true);
  };

  const handleAcceptRequest = async (user) => {
    try {
      const res = await approveStatusChange({
        id: user._id,
        status: "accept",
      }).unwrap();

      if (res?.code === 200) {
        toast.success(res.message);
        setDetailsVisible(false);
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const handleDeclineRequest = async (user) => {
    try {
      const res = await approveStatusChange({
        id: user._id,
        status: "reject",
      }).unwrap();

      if (res?.code === 200) {
        toast.success(res.message);
        setDetailsVisible(false);
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "#SI",
      render: (_, __, index) =>
        (pagination?.page - 1) * limit + index + 1,
    },
    { title: "Full Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      render: (date) =>
        moment(date).format("DD MMM YYYY"),
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
      <Toaster />

      {/* HEADER */}
      <div className="md:flex justify-between items-center py-6 mb-4">
        <Link to="/provider-list" className="text-2xl flex items-center">
          <FaAngleLeft />
          <span className="ml-2">
            New Provider List {detailsVisible ? "Details" : ""}
          </span>
        </Link>

        {/* FILTERS */}
        <Form layout="inline" className="flex space-x-2">
          <Item>
            <DatePicker
              placeholder="From Date"
              onChange={(date) =>
                setSelectedDate([date, selectedDate[1]])
              }
            />
          </Item>

          <Item>
            <DatePicker
              placeholder="To Date"
              onChange={(date) =>
                setSelectedDate([selectedDate[0], date])
              }
            />
          </Item>

          {/* <Item>
            <Input
              placeholder="Search by Name"
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
            />
          </Item> */}
{/* 
          <Item>
            <button
              type="button"
              className="size-8 rounded-full bg-[#778beb] text-white flex justify-center items-center"
            >
              <IoIosSearch />
            </button>
          </Item> */}
        </Form>
      </div>

      {/* CONTENT */}
      <div
        className={`${
          detailsVisible ? "grid lg:grid-cols-2 gap-5" : "block"
        }`}
      >
        {/* TABLE */}
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#778beb",
                headerColor: "#fff",
              },
            },
          }}
        >
          <Table
            rowKey="_id"
            loading={isLoading}
            columns={columns}
            dataSource={providers}
            scroll={{ x: "max-content" }}
            pagination={{
              current: pagination?.page,
              pageSize: pagination?.limit,
              total: pagination?.totalResults,
              position: ["bottomCenter"],
              onChange: (page) => setPage(page),
            }}
          />
        </ConfigProvider>

        {/* DETAILS */}
        {detailsVisible && (
          <div>
            <div className="border-2 p-3 rounded-lg relative">
              <div
                onClick={() => setDetailsVisible(false)}
                className="absolute -top-5 -left-5 bg-[#778beb] p-3 rounded-full cursor-pointer"
              >
                <FaArrowLeft className="text-white" />
              </div>

              <div className="flex justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    className="w-24 h-24 rounded-full"
                    src={
                      userDataFull?.profileImage?.imageUrl?.includes(
                        "amazonaws"
                      )
                        ? userDataFull?.profileImage?.imageUrl
                        : Url +
                          userDataFull?.profileImage?.imageUrl
                    }
                    alt=""
                  />
                  <h2 className="text-2xl font-semibold capitalize">
                    {userDataFull?.name}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAcceptRequest(userDataFull)
                    }
                    className="px-6 py-2 bg-[#778beb] text-white rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleDeclineRequest(userDataFull)
                    }
                    className="px-6 py-2 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* DETAILS INFO */}
              {[
                ["Email", userDataFull?.email],
                ["Role", userDataFull?.role],
                ["Gender", userDataFull?.gender],
                [
                  "Created Date",
                  moment(userDataFull?.createdAt).format(
                    "YYYY-MM-DD"
                  ),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border p-2 rounded mb-2"
                >
                  <span className="font-semibold">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProviderListNewProviderRequest;
