import React, { useState } from "react";
import { Table, Modal, Pagination, ConfigProvider, Form, Input, Button, Select, message } from "antd";
import { FaInfoCircle, FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import moment from "moment";

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

    // Handle Add Sub Admin form submission
    const handleAddSubAdmin = (values) => {
        const newSubAdmin = { ...values, createdAt: new Date(), id: demoSubAdmins.length + 1 };
        demoSubAdmins.push(newSubAdmin);

        message.success("Sub Admin added successfully!");
        setIsAddModalVisible(false);
    };

    // Handle Edit Sub Admin form submission
    const handleEditSubAdmin = (values) => {
        const updatedUser = { ...selectedUser, ...values }; // Merge updated values

        // Simulate editing sub admin
        message.success("Sub Admin updated successfully!");
        setIsEditModalVisible(false);
        setSelectedUser(updatedUser); // Update the displayed user data
    };

    // Handle Delete Sub Admin
    const handleDelete = (item) => {
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
            title: "Phone Number",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Joining Date",
            dataIndex: "joiningDate",
            key: "joiningDate",
            render: (date) => moment(date).format("DD MMM YYYY"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => <div>
                {status == "Active" ?
                    <span className="py-1 px-5 rounded-lg  bg-green-100 text-green-600">Active </span> :
                    <span className="py-1 px-5 rounded-lg  bg-red-100 text-red-600">Inactive </span>
                }
            </div>,
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
                    <button
                        onClick={() => handleOpenEditModal(record)}
                        className="text-xl text-[#778beb] hover:text-[#778beb]"
                    >
                        <FaRegEdit />
                    </button>
                </div>
            ),
        },
    ];

    // Paginate Data
    const paginatedData = demoSubAdmins.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                    total={demoSubAdmins.length || 0}
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
                        <p className="my-5 flex items-center justify-between"><strong>Phone Number:</strong> {selectedUser.phone}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Joining Date:</strong> {moment(selectedUser.createdAt).format("DD MMM YYYY")}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Status:</strong> {selectedUser.status}</p>
                    </div>
                )}
            </Modal>

            {/* Add Sub Admin Modal */}
            <Modal open={isAddModalVisible} onCancel={handleCloseAddModal} footer={null} title="Add New Sub Admin">
                <Form form={form} layout="vertical" onFinish={handleAddSubAdmin}>
                    <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter full name" }]}>
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter phone number" }]}>
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                    <Form.Item label="Status" name="status" rules={[{ required: true, message: "Please select status" }]}>
                        <Select defaultValue="Active" onChange={(value) => setStatus(value)}>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleCloseAddModal} className="mr-3">Cancel</Button>
                        <Button type="primary" htmlType="submit">Add Sub Admin</Button>
                    </div>
                </Form>
            </Modal>

            {/* Edit Sub Admin Modal */}
            <Modal open={isEditModalVisible} onCancel={handleCloseEditModal} footer={null} title="Edit Sub Admin">
                <Form form={form} layout="vertical" onFinish={handleEditSubAdmin}>
                    <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter full name" }]}>
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter phone number" }]}>
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                    <Form.Item label="Status" name="status" rules={[{ required: true, message: "Please select status" }]}>
                        <Select defaultValue={selectedUser?.status} onChange={(value) => setStatus(value)}>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleCloseEditModal} className="mr-3">Cancel</Button>
                        <Button type="primary" htmlType="submit">Save Changes</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Lawyera;