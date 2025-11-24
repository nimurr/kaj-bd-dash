import React, { useState } from "react";
import { Table, Modal, Pagination, ConfigProvider, Form, Input, Button, Select, message } from "antd";
import { FaInfoCircle, FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import moment from "moment";
import { useCreateNewAdminsMutation, useGetAdminsQuery } from "../../redux/features/admins/admins";

const Lawyera = () => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit Modal visibility
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
    const [status, setStatus] = useState("Active");

    // Demo data for testing
    const demoSubAdmins = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "123456789", createdAt: "2025-09-09T10:00:00Z", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987654321", createdAt: "2025-09-08T12:00:00Z", status: "Inactive" },
        { id: 3, name: "Alice Johnson", email: "alice@example.com", phone: "456789123", createdAt: "2025-09-07T09:00:00Z", status: "Active" },
        // Add more demo data as required
    ];


    const { data, refetch } = useGetAdminsQuery({ page: currentPage, limit: pageSize });
    const fullData = data?.data?.attributes?.results || [];
    const pageItems = data?.data?.attributes?.totalPages || 0;

    // console.log(fullData)


    // Handle "View Details" Modal
    const showDetails = (record) => {
        setSelectedUser(record);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalVisible(false);
    };

    // Handle "Add Sub Admin" Modal
    const handleOpenAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalVisible(false);
        form.resetFields();
    };

    // Handle "Edit Sub Admin" Modal
    const handleOpenEditModal = (record) => {
        setSelectedUser(record);
        form.setFieldsValue({
            fullName: record.name,
            email: record.email,
            phone: record.phone,
            status: record.status,
        });
        setIsEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
        form.resetFields();
    };

    const [createNewAdmin] = useCreateNewAdminsMutation();

    // Handle Add Sub Admin form submission
    const handleAddSubAdmin = async (values) => {
        // const newSubAdmin = { ...values, createdAt: new Date(), id: fullData?.length + 1 };
        // fullData?.push(newSubAdmin);
        const fullData = {
            ...values,
            role: "subAdmin",
            message: "Welcome Welcome Welcome Welcome"
        }

        try {

            const res = await createNewAdmin(fullData).unwrap();
            console.log(res);
            if (res?.code === 200) {
                message.success(res?.message);
                setIsAddModalVisible(false);
                refetch();
            }
        } catch (error) {
            message.error(error?.data?.message, "Something went wrong");
            // setIsAddModalVisible(false);
        }
    };


    // Handle Delete Sub Admin
    const handleDelete = (item) => {

        console.log(item)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // Simulate delete
                message.success("Sub Admin deleted successfully!");
                  console.log(item)
            }
        });
    };

    // Table Columns
    const columns = [
        {
            title: "#SI",
            dataIndex: "key",
            key: "key",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Sub Admin Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Joining Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => moment(date).format("DD MMM YYYY"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <FaInfoCircle
                        className="text-xl cursor-pointer text-gray-500 hover:text-[#778beb]"
                        onClick={() => showDetails(record)}
                    />
                    <MdDeleteForever
                        onClick={() => handleDelete(record)}
                        className="text-2xl cursor-pointer text-red-600 hover:text-red-500"
                    />
                </div >
            ),
        },
    ];

    // Paginate Data
    const paginatedData = fullData?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="py-10 text-base">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-semibold mb-4">Sub Admin List</h2>
                <button onClick={handleOpenAddModal} className="bg-[#778beb] text-white text-xl py-2 px-8 rounded">
                    Add Sub Admin
                </button>
            </div>

            {/* Table with Ant Design ConfigProvider */}
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
                    pagination={false} // Disabled default pagination to use custom
                    scroll={{ x: "max-content" }}
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="key"
                    bordered
                    className="shadow-md"
                />
            </ConfigProvider>

            {/* Custom Pagination */}
            <div className="flex justify-end mt-5">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={pageItems || 0}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </div>

            {/* Sub Admin Details Modal */}
            <Modal open={isModalVisible} onCancel={handleCloseModal} footer={null} title="Sub Admin Details">
                {selectedUser && (
                    <div className="text-gray-700">
                        <p className="my-5 flex items-center justify-between"><strong>Full Name:</strong> {selectedUser.name}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Email:</strong> {selectedUser.email}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Role:</strong> {selectedUser.role}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Joining Date:</strong> {moment(selectedUser.createdAt).format("DD MMM YYYY")}</p>
                    </div>
                )}
            </Modal>

            {/* 
    need modal with this items for create sub admin
{
    "email":"djxyz99@gmail.com",
    "password": "asdfadsf",
    "name": "Sub Admin Test By Nerob V0",
    "role" : "subAdmin",
    "message" : "Welcome Welcome Welcome Welcome"
} */}

            {/* Add Sub Admin Modal */}
            <Modal open={isAddModalVisible} onCancel={handleCloseAddModal} footer={null} title="Add New Sub Admin">
                <Form form={form} layout="vertical" onFinish={handleAddSubAdmin}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter full name" }]}>
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter phone number" }]}>
                        <Input placeholder="Enter password" />
                    </Form.Item>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleCloseAddModal} className="mr-3">Cancel</Button>
                        <Button type="primary" htmlType="submit">Add Sub Admin</Button>
                    </div>
                </Form>
            </Modal>

        </div>
    );
};

export default Lawyera;