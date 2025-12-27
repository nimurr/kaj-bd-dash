import { useState } from "react";
import { ConfigProvider, Table, Form, Input, DatePicker, Image } from "antd";
import moment from "moment";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import Url from "../../redux/baseApi/forImageUrl.js";
import { useGetAllProvidersQuery } from "../../redux/features/providers/providers.js";

const { Item } = Form;

const ProviderList = () => {
  // ================= STATE =================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState([null, null]);

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [userDataFull, setUserDataFull] = useState(null);

  // ================= API =================
  const { data, isLoading } = useGetAllProvidersQuery({
    page,
    limit,
    searchData: searchText,
    from: selectedDate[0]
      ? selectedDate[0].startOf("day").toISOString()
      : "2024-01-01",
    to: selectedDate[1]
      ? selectedDate[1].endOf("day").toISOString()
      : "2222-12-31",
  });

  // ================= DATA =================
  const providers = data?.data?.attributes?.results || [];
  const pagination = data?.data?.attributes;
  console.log(providers)

  // ================= HANDLER =================
  const handleShowDetails = (user) => {
    setUserDataFull(user);
    setDetailsVisible(true);
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

  console.log(pagination?.totalResults)

  // ================= JSX =================
  return (
    <section>
      {/* HEADER */}
      <div className="md:flex justify-between items-center space-y-2 py-6 mb-4">
        <Link to="/" className="text-2xl flex items-center">
          <FaAngleLeft />
          <span className="ml-2">
            Provider list {detailsVisible ? "Details" : ""}
          </span>
        </Link>

        {/* FILTERS */}
        <Form layout="inline" className="flex space-x-2">
          <Link
            to="/provider-list/new-provider-request"
            className="py-2 px-8 text-white rounded-lg bg-[#778beb]"
          >
            New Provider Request
          </Link>

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

          <Item>
            <Input
              placeholder="Search by Name"
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

      {/* CONTENT */}
      <div
        className={`${detailsVisible ? "grid lg:grid-cols-2 gap-5" : "block"
          } duration-500`}
      >
        {/* TABLE */}
        <div className="w-full overflow-x-auto ">
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
              rowKey="id"
              loading={isLoading}
              columns={columns}
              dataSource={providers}
              scroll={{ x: "max-content" }}
              pagination={{
                current: pagination?.page,
                pageSize: pagination?.limit,
                total: pagination?.totalResults, // Total number of items
                position: ["bottomCenter"],
                onChange: (page) => setPage(page),
              }}
            />
          </ConfigProvider>
        </div>

        {/* DETAILS */}
        {detailsVisible && (
          <div className="duration-500">
            <div className="w-full md:w-3/4 mx-auto border-2 p-2 rounded-lg relative">
              <div
                onClick={() => setDetailsVisible(false)}
                className="absolute bg-[#778beb] p-3 rounded-full -top-5 -left-5 cursor-pointer"
              >
                <FaArrowLeft className="text-xl text-yellow-50" />
              </div>

              <div className="flex justify-between items-center ">
                <div className="flex items-center gap-5 mb-5">
                  <img
                    className="w-24 h-24 rounded-full"
                    src={
                      userDataFull?.profileImage?.imageUrl?.includes(
                        "amazonaws"
                      )
                        ? userDataFull?.profileImage?.imageUrl
                        : Url + userDataFull?.profileImage?.imageUrl
                    }
                    alt="Provider"
                  />
                  <h1 className="text-2xl font-semibold">
                    {userDataFull?.name}
                  </h1>
                </div>
                <div>
                  <button className="py-2 px-8 bg-[#778beb] text-white rounded">Block</button>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["Name", userDataFull?.name],
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
                    className="flex justify-between border-2 p-2 rounded-lg"
                  >
                    <span className="font-semibold">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-xl font-semibold mt-4 mb-2">Face Image from Front Camera</h2>
                <Image className="w-full" src={userDataFull?.faceImageFromFrontCam[0]} alt="" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mt-4 mb-2">Front Side Certificate Image</h2>
                <Image className="w-full" src={userDataFull?.frontSideCertificateImage[0]} alt="" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProviderList;
