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
        </div>
    );
}

export default ContactUs;
