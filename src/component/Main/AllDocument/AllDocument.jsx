import Dragger from 'antd/es/upload/Dragger';
import React, { useEffect, useState } from 'react';
import { LuImagePlus } from 'react-icons/lu';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useAddBannerMutation, useDeleteBannerMutation, useGetBannersQuery } from '../../../redux/features/banners/banners';
import Url from '../../../redux/baseApi/forImageUrl';
import { message } from 'antd';
import { useCreatePercentageMutation, useGetPercentageQuery } from '../../../redux/features/percentage/percentage';

const AllDocument = () => {

    //? =========== banner ===========
    const { data: banner, refetch, isLoading } = useGetBannersQuery();
    const allBanner = banner?.data?.attributes;

    const [addBanner] = useAddBannerMutation();
    const [deleteBanner] = useDeleteBannerMutation();
    const user = JSON.parse(localStorage.getItem("user"));


    // State to store the uploaded image file
    const [storeFileImage, setStoreFileImage] = useState(null);
    // State to store the percentage input
    const [percentage, setPercentage] = useState('');


    // Handle image upload
    const handleUploadImage = async (file) => {
        // Store the file data (you can modify this to save it to the server, etc.)
        setStoreFileImage(file);

        try {
            const formData = new FormData();
            formData.append('attachments', file);

            const res = await addBanner(formData).unwrap();
            console.log("Banner uploaded successfully: ", res);
            if (res.code === 200) {
                message.success("Banner uploaded successfully.");
                setStoreFileImage(null);
                refetch();
            }
            else {
                message.error(res?.message || "Failed to upload banner. Please try again.");
            }

        } catch (error) {
            console.log(error)
            message.error("Failed to upload banner. Please try again.");
        }
    }

    const handleDeleteBannerItem = async (bannerItem) => {
        try {
            const res = await deleteBanner({ id: bannerItem._BannerId }).unwrap();
            console.log("Banner deleted successfully: ", res);
            if (res.code === 200) {
                message.success("Banner deleted successfully.");
                refetch();
            }
            else {
                message.error(res?.message || "Failed to delete banner. Please try again.");
            }

        } catch (error) {
            console.log("Error deleting banner: ", error);
            message.error("Failed to delete banner. Please try again.");
        }
    }


    // Handle percentage input change
    const handlePercentageChange = (event) => {
        setPercentage(event.target.value);
    }

    const { data: percentageData } = useGetPercentageQuery();
    const existingPercentage = percentageData?.data?.attributes[0]?.percentage || 0;
    console.log(existingPercentage)

    const [addPercentage, { isLoading: isLoadingPercentage }] = useCreatePercentageMutation();

    // Handle percentage submit
    const handleSubmitPercentage = async () => {

        try {
            const percentageData = { percentage: Number(percentage) };
            const res = await addPercentage(percentageData).unwrap();
            console.log("Percentage added successfully: ", res);
            if (res.code === 200) {
                message.success("Percentage added successfully.");
                setPercentage('');
            }

        } catch (error) {
            console.log("Error adding percentage: ", error);
            message.error("Failed to add percentage. Please try again.");
        }
    }

    return (
        <div className='my-10 px-5 grid xl:grid-cols-4 items-start gap-10'>
            {/* Section for Banner Document */}
            <section className='space-y-5 xl:col-span-3 p-5 bg-gray-100 rounded-lg'>
                <h2 className='text-3xl font-medium mb-5'>Add Banner</h2>
                <div className=' w-full rounded-lg bg-gray-50 p-5 mt-5'>
                    <div>
                        <Dragger
                            className=''
                            beforeUpload={(file) => {
                                handleUploadImage(file);
                                return false; // Prevent auto upload, handle it manually
                            }}
                        >
                            <p className="ant-upload-drag-icon flex items-center justify-center py-2">
                                <LuImagePlus className='text-3xl' />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
                            </p>
                        </Dragger>
                    </div>
                    <button onClick={() => console.log(storeFileImage)} className='py-2 w-full mt-5 bg-[#778beb] text-white rounded'>
                        Upload
                    </button>
                </div>
                <div>
                    <div className='grid md:grid-cols-2 gap-3 '>
                        {
                            allBanner?.map((bannerItem, index) => (
                                <div className='relative bg-white rounded-lg overflow-hidden' key={index}>
                                    <img className=' w-full rounded-lg' src={bannerItem?.attachments[0]?.attachment.includes('amazonaws') ? bannerItem?.attachments[0]?.attachment : Url + bannerItem?.attachments[0]?.attachment?.url} alt="Banner" />
                                    <span onClick={() => handleDeleteBannerItem(bannerItem)} className='bg-[#778beb] w-10 h-10 cursor-pointer absolute top-2 right-2 rounded-full flex items-center justify-center text-white'><MdOutlineDeleteForever className='text-2xl' /></span>
                                </div>
                            ))
                        }
                    </div>
                    {
                        isLoading && <div className='grid md:grid-cols-2 gap-3'>
                            {
                                [...Array(4)].map((_, index) => (

                                    <div class="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
                                        <div class="flex animate-pulse space-x-4">
                                            <div class="flex-1 space-y-6 py-1">
                                                <div class="h-2 rounded bg-gray-200"></div>
                                                <div class="h-2 rounded bg-gray-200"></div>
                                                <div class="h-2 rounded bg-gray-200"></div>
                                                <div class="h-2 rounded bg-gray-200"></div>
                                                <div class="h-2 rounded bg-gray-200"></div>
                                                <div class="h-2 rounded bg-gray-200"></div>
                                                <div class="h-2 rounded bg-gray-200"></div>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>

            </section>



            {
                user.role === 'admin' &&
                <section className='space-y-5 w-full p-5 bg-gray-100 rounded-lg'>
                    <div>
                        <h2 className='text-3xl font-medium mb-5'>Add Percentage</h2>
                        <p>Admin Added Total Percentage is <span className='text-xl font-semibold text-blue-600'>{existingPercentage}%</span></p>
                    </div>
                    <div>
                        <input
                            type="number"
                            defaultValue={existingPercentage}  // Bind the input value to state
                            onChange={handlePercentageChange}  // Update state on change
                            placeholder='Enter Percentage'
                            className='w-full px-5 py-2 text-[16px] border border-[#778beb] outline-none focus:border-[#778beb] focus:border-2 text-[#778beb] rounded-lg resize-none'
                        />
                        <button onClick={handleSubmitPercentage} className='py-2 w-full bg-[#778beb] text-white mt-5 rounded-[5px]'>
                            Submit {isLoadingPercentage && '...'}
                        </button>
                    </div>
                </section>
            }

            {/* Section for Percentage */}
        </div>
    );
}

export default AllDocument;
