import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const ContactUs = () => {
    return (
        <div>
            <div className="flex justify-between items-center py-5">
                <Link to="/settings" className="flex gap-2 items-center">
                    <>
                        <FaArrowLeft className="text-2xl" />
                    </>
                    <h1 className="text-2xl font-semibold">Contact Us</h1>
                </Link>
            </div>
            <div className='grid lg:grid-cols-2 gap-10'>
                <div className='bg-gray-100 p-5 rounded-lg'>
                    <h2 className='my-5 text-xl underline'>Contact Details</h2>
                    <div>
                        <span className='font-semibold text-xl mb-2'>Eamil</span>
                        <h2>nimurnerob404@gmail.com</h2>
                    </div>
                    <div className='mt-2'>
                        <span className='font-semibold text-xl mb-2'>Phone Number</span>
                        <h2>+88 01708784404</h2>
                    </div>
                </div>
                <div className='bg-gray-100 p-5 rounded-lg'>
                    <div>
                        <span className='font-semibold text-xl mb-2 block'>Eamil</span>
                        <input className='p-2 rounded-lg w-full ' placeholder='Enter Your Contact Email' type="text" name="email" id="" />
                    </div>
                    <div className='mt-2'>
                        <span className='font-semibold text-xl mb-2 block'>Phone Number</span>
                        <input className='p-2 rounded-lg w-full ' placeholder='Enter Your Contact Number' type="number" name="number" id="" />
                    </div>
                    <div className='mt-5'>
                        <button className='py-2 px-8 rounded-lg bg-[#778beb] text-white'>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
