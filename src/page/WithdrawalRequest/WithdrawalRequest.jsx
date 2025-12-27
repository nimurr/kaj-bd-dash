import React, { useState } from "react";
import {
    Table,
    Button,
    Modal,
    ConfigProvider,
    Form,
    DatePicker,
    Input,
    message,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import Url from "../../redux/baseApi/forImageUrl";
import {
    useApproveAndRejectMutation,
    useGetWithdrawalQuery,
} from "../../redux/features/withdrawal/withdrawal";

const WithdrawalRequest = () => {
    // ================= STATE =================
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [status, setStatus] = useState("requested");
    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState([null, null]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [proof, setProof] = useState(null);

    // ================= API =================
    const { data, isLoading, refetch } = useGetWithdrawalQuery({
        page,
        limit,
        status,
        // searchText,
        from: selectedDate[0]
            ? selectedDate[0].startOf("day").toISOString()
            : "2024-01-01",
        to: selectedDate[1]
            ? selectedDate[1].endOf("day").toISOString()
            : "3222-12-31",
    });

    const withdrawals = data?.data?.attributes?.results || [];
    const pagination = data?.data?.attributes;

    // ================= MUTATION =================
    const [approveReject] = useApproveAndRejectMutation();

    // ================= HANDLERS =================
    const handleShowDetails = (record) => {
        setModalData(record);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setModalData(null);
        setProof(null);
    };

    const handleUploadProof = (e) => {
        setProof(e.target.files[0]);
    };

    const handleApprove = async () => {
        if (!proof) return message.error("Upload proof of payment");

        const formData = new FormData();
        formData.append("proofOfPayment", proof);
        formData.append("status", "accept");

        const res = await approveReject({
            id: modalData?._WithdrawalRequstId,
            data: formData,
        });

        if (res?.error) {
            message.error(res?.error?.data?.message);
        } else {
            message.success(res?.data?.message);
            handleCloseModal();
            refetch();
        }
    };

    const handleReject = async () => {
        const formData = new FormData();
        formData.append("status", "reject");

        const res = await approveReject({
            id: modalData?._WithdrawalRequstId,
            data: formData,
        });

        if (res?.error) {
            message.error(res?.error?.data?.message);
        } else {
            message.success(res?.data?.message);
            handleCloseModal();
            refetch();
        }
    };

    // ================= TABLE COLUMNS =================
    const columns = [
        {
            title: "#SI",
            render: (_, __, index) =>
                (pagination?.page - 1) * limit + index + 1,
        },
        {
            title: "Provider Name",
            dataIndex: "userId",
            render: (u) => u?.name,
        },
        {
            title: "Bank Name",
            dataIndex: "bankName",
        },
        {
            title: "A/C Number",
            dataIndex: "bankAccountNumber",
        },
        {
            title: "Withdraw Amount",
            dataIndex: "requestedAmount",
            render: (a) => `৳${a}`,
        },
        {
            title: "Request Date",
            dataIndex: "requestedAt",
            render: (d) => moment(d).format("DD MMM YYYY"),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s) => (
                <span
                    className={`capitalize ${s === "rejected"
                            ? "text-red-500"
                            : s === "completed"
                                ? "text-green-600"
                                : "text-yellow-600"
                        }`}
                >
                    {s}
                </span>
            ),
        },
        {
            title: "Action",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined className="text-xl" />}
                    onClick={() => handleShowDetails(record)}
                />
            ),
        },
    ];

    // ================= JSX =================
    return (
        <div className="p-5">
            {/* HEADER */}
            <div className="flex justify-between flex-wrap gap-4 mb-5">
                <h1 className="text-2xl font-semibold">
                    Withdrawal Requests
                </h1>

                {/* FILTERS */}
                <Form className="flex gap-3 flex-wrap">
                    {/* <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          /> */}

                    <select
                        className="py-1 px-4 rounded border"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="requested">Requested</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                    </select>

                    <DatePicker
                        placeholder="From Date"
                        onChange={(date) =>
                            setSelectedDate([date, selectedDate[1]])
                        }
                    />
                    <DatePicker
                        placeholder="To Date"
                        onChange={(date) =>
                            setSelectedDate([selectedDate[0], date])
                        }
                    />
                </Form>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto">
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
                        rowKey="_WithdrawalRequstId"
                        loading={isLoading}
                        columns={columns}
                        dataSource={withdrawals}
                        pagination={{
                            current: pagination?.page,
                            pageSize: pagination?.limit,
                            total: pagination?.totalResults,
                            onChange: (p) => setPage(p),
                        }}
                    />
                </ConfigProvider>
            </div>

            {/* MODAL */}
            <Modal
                title="Withdrawal Details"
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={700}
            >
                {modalData && (
                    <div className="space-y-3">
                        <p className="flex items-center justify-between">
                            <strong>Name:</strong> {modalData?.userId?.name}
                        </p>
                        <p className="flex items-center justify-between">
                            <strong>Email:</strong> {modalData?.userId?.email}
                        </p>
                        <p className="flex items-center justify-between">
                            <strong>Bank:</strong> {modalData?.bankName}
                        </p>
                        <p className="flex items-center justify-between">
                            <strong>Account:</strong>{" "}
                            {modalData?.bankAccountNumber}
                        </p>
                       <p className="flex items-center justify-between">
                            <strong>Amount:</strong> ৳
                            {modalData?.requestedAmount}
                        </p>

                        {modalData?.proofOfPayment?.[0] && (
                            <img
                                className="w-full mt-3"
                                src={
                                    modalData?.proofOfPayment[0]?.attachment?.includes(
                                        "amazonaws"
                                    )
                                        ? modalData?.proofOfPayment[0]?.attachment
                                        : Url +
                                        modalData?.proofOfPayment[0]?.attachment
                                }
                                alt=""
                            />
                        )}

                        <input type="file" onChange={handleUploadProof} />

                        <div className="flex gap-3 mt-3">
                            <button
                                onClick={handleApprove}
                                className="px-6 py-2 bg-[#778beb] text-white rounded"
                            >
                                Approve
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-6 py-2 border rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WithdrawalRequest;