import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Pagination } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateServiceMutation, useDeleteServiceMutation, useEditServiceMutation, useGetAllServicesQuery } from '../../redux/features/allServices/allServices';
import Url from '../../redux/baseApi/forImageUrl';

const AllServices = () => {
    const pageSize = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [totalServices, setTotalServices] = useState(0); // Total number of services

    // Fetch services based on the current page and page size
    const { data, isLoading, isError, refetch } = useGetAllServicesQuery({
        page: currentPage,
        limit: pageSize
    });

    const fullServicesData = data?.data?.attributes?.results || [];
    const totalCount = data?.data?.attributes?.totalCount || 0; // Total number of services

    console.log(fullServicesData)

    const [services, setServices] = useState(fullServicesData);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null); // To track which service is being edited

    // API hooks
    const [createService] = useCreateServiceMutation();

    useEffect(() => {
        if (data) {
            setServices(data?.data?.attributes?.results); // Set services when data is fetched
            setTotalServices(totalCount); // Set total count for pagination
        }
    }, [data]);

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const openEditModal = (service) => {
        setCurrentService(service);
        setIsEditModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentService(null);
    };

    // Handle Add Service
    const handleAddService = async (event) => {
        event.preventDefault();
        const serviceName = event.target.serviceName.value;
        const image = event.target.image.files[0];


        if (serviceName && image) {
            const formData = new FormData();
            formData.append("attachments", image);
            formData.append("name", serviceName);

            try {
                const response = await createService(formData).unwrap(); // Call API to add service
                if (response?.data) {
                    setServices([...services, response.data]); // Update services state
                    closeAddModal();
                    message.success('Service added successfully!');
                }
            } catch (error) {
                message.error('Failed to add service.');
            }
        } else {
            message.error('Please provide a service name and upload an image.');
        }
    };

    const [updateService, { isLoading: isUpdating }] = useEditServiceMutation();
    // Handle Edit Service
    const handleEditService = async (event) => {
        event.preventDefault();
        const serviceName = event.target.serviceName.value;
        const image = event.target.image.files[0];
        const isVisible = event.target.isVisible.value;
        console.log(image)

        const formData = new FormData();
        if (image) {
            formData.append("attachments", image);
        }
        if (serviceName) {
            formData.append("name", serviceName);
        }
        if (isVisible) {
            formData.append("isVisible", isVisible);
        }

        try {
            const response = await updateService({ id: currentService._ServiceCategoryId, formData: formData }); // Call API to update service
            console.log(response)
            if (response?.data) {
                closeEditModal();
                refetch();
                message.success('Service updated successfully!');
            }
            if (response?.error) {
                message.error(response.error.data.message);
            }
        } catch (error) {
            message.error('Failed to update service.');
        }
    };

    const [deleteService] = useDeleteServiceMutation();
    // Handle Delete Service
    const handleDeleteService = async (id) => {
        try {
            const response = await deleteService(id); // Call API to delete service
            console.log(response)
            if (response?.data) {
                refetch();
                message.success('Service deleted successfully!');
            }
            if (response?.error) {
                message.error(response.error.data.message);
            }
        } catch (error) {
            message.error('Failed to delete service.');
        }
    };

    // Handle page change
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='p-5'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">All Services</h1>
                <button type="primary" onClick={openAddModal} className="bg-[#778beb] text-white px-8 !py-2 rounded">
                    Add Service
                </button>
            </div>

            <div className="grid lg:grid-cols-4 sm:grid-cols-2 items-start gap-5">
                {fullServicesData?.map(service => (
                    <div key={service.id} className="p-4 border-2 border-[#778beb] rounded-lg">
                        <div className="flex items-start justify-between">
                            <div className="bg-[#778aeb5e] rounded-full w-24 h-24 flex items-center justify-center">
                                <img className="w-20 h-20 rounded-full" src={service?.attachments[0]?.attachment?.includes('amazonaws') ? service?.attachments[0]?.attachment : (Url + service?.attachments[0]?.attachment)} alt="" />
                            </div>
                            <span className={`${service?.isVisible ? 'text-green-500 bg-green-100 py-1 px-3 rounded-lg' : 'text-red-500 bg-red-100 py-1 px-3 rounded-lg'} `}>{service?.isVisible ? 'Active' : 'Inactive'}</span>
                        </div>
                        <span className="text-2xl font-semibold block my-5 border-b border-dashed">{service?.name?.en}</span>
                        <div className="flex gap-4">
                            <Button type="default" onClick={() => openEditModal(service)} className="bg-[#778beb] text-white px-4 py-2 rounded">
                                Edit
                            </Button>
                            <Button type="danger" onClick={() => handleDeleteService(service._ServiceCategoryId)} className="border border-[#778beb] text-[#778beb] px-4 py-2 rounded">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className='flex justify-end'>
                <Pagination
                    current={currentPage}
                    total={totalServices}
                    pageSize={pageSize}
                    onChange={onPageChange}
                    showSizeChanger={false}
                    className="mt-5"
                />
            </div>

            {/* Add Service Modal */}
            <Modal
                title="Add Service"
                visible={isAddModalOpen}
                onCancel={closeAddModal}
                footer={null}
            >
                <form onSubmit={handleAddService}>
                    <div>
                        <label>Service Name</label>
                        <Input name="serviceName" placeholder="Enter the service name" className="block mt-2 py-2" />
                    </div>

                    <div className="mt-4">
                        <label>Upload Image</label>
                        <input type="file" name="image" className="block mt-2" />
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <Button onClick={closeAddModal}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Service Modal */}
            <Modal
                title="Edit Service"
                visible={isEditModalOpen}
                onCancel={closeEditModal}
                footer={null}
            >
                <form onSubmit={handleEditService}>
                    <div>
                        <label>Service Name</label>
                        <Input name="serviceName" defaultValue={currentService?.name?.en} className="block mt-2 py-2" />
                    </div>

                    <div className="my-4">
                        <label>Upload Image</label>
                        <input type="file" name="image" className="block mt-2" />
                    </div>

                    <div>
                        <select defaultValue={currentService?.isVisible} className='w-full mb-2 border p-2 rounded-lg' name="isVisible" id="">
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <Button onClick={closeEditModal}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AllServices;
