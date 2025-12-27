import React, { useState } from "react";
import { Table, Modal, Pagination, ConfigProvider, Form, Input, Button, Select, message } from "antd";
import { FaInfoCircle, FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import moment from "moment";
import { useCreateNewAdminsMutation, useGetAdminsQuery, useRemoveAdminMutation } from "../../redux/features/admins/admins";
import Url from "../../redux/baseApi/forImageUrl";
import { IoInformationCircleOutline } from "react-icons/io5";

const Lawyera = () => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Edit Modal visibility
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
    const [status, setStatus] = useState("Active");



    const { data, refetch, isLoading } = useGetAdminsQuery({ page: currentPage, limit: pageSize });
    const fullData = data?.data?.attributes?.results || [];
    const pageItems = data?.data?.attributes?.totalPages || 0;



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


    const [removeAdmin] = useRemoveAdminMutation();

    // Handle Delete Sub Admin
    const handleDelete = async (item) => {

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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await removeAdmin(item._id).unwrap();
                    console.log(res);
                    if (res?.code === 200) {
                        message.success(res?.message);
                        refetch();
                    }

                } catch (error) {
                    message.error(error?.data?.message, "Something went wrong");
                }
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
                    loading={isLoading}
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
                        <div className="flex items-center justify-center mb-3">
                            <img className="w-[350px] mx-atuo rounded-lg h-[350px]" src={selectedUser.profileImage?.imageUrl.includes('amazonaws') ? selectedUser.profileImage?.imageUrl : Url + selectedUser.profileImage?.imageUrl} alt="" />
                        </div>
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
            <Modal open={isAddModalVisible} onCancel={handleCloseAddModal} footer={null} >

                <h2 className="text-2xl font-semibold mb-3 text-[#778beb]">Add New Sub Admin</h2>

                <Form form={form} layout="vertical" onFinish={handleAddSubAdmin}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter full name" }]}>
                        <Input className="h-12" placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
                        <Input className="h-12" placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter phone number" }]}>
                        <Input className="h-12" placeholder="Enter password" />
                    </Form.Item>
                    <p className="text-blue-500 text-base flex items-start gap-1"><IoInformationCircleOutline size={30} /> After creating the sub admin, an email will be sent to the sub admin with the login credentials.
                    </p>
                    <div className="flex justify-end flex-wrap mt-4">
                        <button className="h-12 mr-3 px-10 py-2 rounded-md bg-[#f16060] text-white" onClick={handleCloseAddModal}  >Cancel</button>
                        <button className="h-12 px-10 py-2 rounded-md bg-[#778beb] text-white" type="primary" htmlType="submit">Add Sub Admin</button>
                    </div>
                </Form>
            </Modal>

        </div>
    );
};

export default Lawyera;