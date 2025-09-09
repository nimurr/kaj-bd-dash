import React, { useState } from "react";
import { Table, Modal, Pagination, ConfigProvider, Form, Input, Button, Upload, message } from "antd";
import { FaInfoCircle } from "react-icons/fa";
import { UploadOutlined } from "@ant-design/icons";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import moment from "moment";

const Lawyera = () => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);  // Edit Modal visibility
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
    const [image, setImage] = useState(null);

    // Demo data for testing
    const demoLawyers = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "123456789", createdAt: "2025-09-09T10:00:00Z", imageUrl: "https://via.placeholder.com/150", experience: 5 },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987654321", createdAt: "2025-09-08T12:00:00Z", imageUrl: "https://via.placeholder.com/150", experience: 7 },
        { id: 3, name: "Alice Johnson", email: "alice@example.com", phone: "456789123", createdAt: "2025-09-07T09:00:00Z", imageUrl: "https://via.placeholder.com/150", experience: 10 },
        // Add more demo lawyers as required
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

    // Handle "Add Lawyer" Modal
    const handleOpenAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalVisible(false);
        form.resetFields();
    };

    // Handle "Edit Lawyer" Modal
    const handleOpenEditModal = (record) => {
        setSelectedUser(record);
        form.setFieldsValue({
            fullName: record.name,
            email: record.email,
            phone: record.phone,
            yearOfExpriences: record.experience,
        });
        setIsEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
        form.resetFields();
    };

    const handleImageUpload = (info) => {
        setImage(info.file?.originFileObj);
    };

    // Handle Add Lawyer form submission
    const handleAddLawyer = (values) => {
        const formData = new FormData();
        formData.append("lawyer_image", image);
        formData.append("lawyer_name", values.fullName);
        formData.append("lawyer_email", values.email);
        formData.append("lawyer_phone_number", values.phone);
        formData.append("lawyer_experience_in_year", values.yearOfExpriences);

        // Simulate adding lawyer
        message.success("Lawyer added successfully!");
        setIsAddModalVisible(false);
    };

    // Handle Edit Lawyer form submission
    const handleEditLawyer = (values) => {
        const updatedUser = { ...selectedUser, ...values, imageUrl: image };  // Merge updated values

        // Simulate editing lawyer
        message.success("Lawyer updated successfully!");
        setIsEditModalVisible(false);
        setSelectedUser(updatedUser);  // Update the displayed user data
    };

    // Handle Delete Lawyer
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
                message.success("Lawyer deleted successfully!");
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
            title: "Full Name",
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
            title: "Joined Date",
            dataIndex: "joinedDate",
            key: "joinedDate",
            render: (date) => moment(date).format("DD MMM YYYY"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-3">
                    <FaInfoCircle
                        className="text-xl cursor-pointer hover:text-blue-500"
                        onClick={() => showDetails(record)}
                    />
                    <MdDeleteForever
                        onClick={() => handleDelete(record)}
                        className="text-2xl cursor-pointer text-red-600 hover:text-red-500"
                    />
                    <button
                        onClick={() => handleOpenEditModal(record)}
                        className="text-xl text-green-600 hover:text-green-500"
                    >
                        Edit
                    </button>
                </div>
            ),
        },
    ];

    // Paginate Data
    const paginatedData = demoLawyers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="py-10 text-base">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-semibold mb-4">Sub Admin List</h2>
                <button onClick={handleOpenAddModal} className="bg-[#038c6d] text-white text-xl py-2 px-8 rounded">
                    Add Sub Admin
                </button>
            </div>

            {/* Table with Ant Design ConfigProvider */}
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: "#92b8c0",
                            headerColor: "#000",
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
            <div className="flex justify-center mt-5">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={demoLawyers.length || 0}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </div>

            {/* Lawyer Details Modal */}
            <Modal open={isModalVisible} onCancel={handleCloseModal} footer={null} title="Lawyer Details">
                {selectedUser && (
                    <div className="text-gray-700">
                        <p className="my-5 flex items-center justify-between"><strong>Full Name:</strong> {selectedUser.name}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Email:</strong> {selectedUser.email}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Phone Number:</strong> {selectedUser.phone}</p>
                        <p className="my-5 flex items-center justify-between"><strong>Joined Date:</strong> {moment(selectedUser.createdAt).format("DD MMM YYYY")}</p>
                        <div>
                            <img className="w-2/4 mx-auto" src={selectedUser.imageUrl} alt="" />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Lawyer Modal */}
            <Modal open={isAddModalVisible} onCancel={handleCloseAddModal} footer={null} title="Add New Lawyer">
                <Form form={form} layout="vertical" onFinish={handleAddLawyer}>
                    <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter full name" }]}>
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter phone number" }]}>
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                    <Form.Item label="Year of Experience" name="yearOfExpriences" rules={[{ required: true, message: "Please enter year of experience" }]}>
                        <Input placeholder="Enter year of experience" />
                    </Form.Item>
                    <Form.Item label="Image" name="image" rules={[{ required: true, message: "Please upload an image" }]}>
                        <Upload listType="picture" maxCount={1} onChange={handleImageUpload}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleCloseAddModal} className="mr-3">Cancel</Button>
                        <Button type="primary" htmlType="submit">Add Lawyer</Button>
                    </div>
                </Form>
            </Modal>

            {/* Edit Lawyer Modal */}
            <Modal open={isEditModalVisible} onCancel={handleCloseEditModal} footer={null} title="Edit Lawyer">
                <Form form={form} layout="vertical" onFinish={handleEditLawyer}>
                    <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter full name" }]}>
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter phone number" }]}>
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                    <Form.Item label="Year of Experience" name="yearOfExpriences" rules={[{ required: true, message: "Please enter year of experience" }]}>
                        <Input placeholder="Enter year of experience" />
                    </Form.Item>
                    <Form.Item label="Image" name="image" rules={[{ required: true, message: "Please upload an image" }]}>
                        <Upload listType="picture" maxCount={1} onChange={handleImageUpload}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
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
