import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoLocationSharp, IoTime } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useGetCompletedProviderDetailsQuery, useGetCompletedUserDetailsQuery, useGetFullCompletedWorkTrakerQuery } from "../../redux/features/WorkTraker/workTraker";
import moment from "moment";
import Url from "../../redux/baseApi/forImageUrl";
import { Image } from "antd";

const workData = {
    status: "Completed",
};

const WorkTrakercompleted = () => {
    const { id } = useParams();

    const { data } = useGetFullCompletedWorkTrakerQuery(id);
    const fullCompletedData = data?.data?.attributes;

    const [detailsVisible, setDetailsVisible] = useState(false);
    const [viewTarget, setViewTarget] = useState(null);

    const [userId, setUserId] = useState(null);
    const [providerId, setProviderId] = useState(null);

    const { data: userDetailsData } = useGetCompletedUserDetailsQuery(userId);
    const fullUserDetailsData = userDetailsData?.data?.attributes?.results[0];

    const { data: providerDetailsData } = useGetCompletedProviderDetailsQuery(providerId);
    const fullProviderDetailsData = providerDetailsData?.data?.attributes?.results[0];

    const [fullUserDetails, setFullUserDetails] = useState(null);

    useEffect(() => {
        if (fullUserDetailsData) {
            setFullUserDetails(fullUserDetailsData);
        } else {
            setFullUserDetails(fullProviderDetailsData);
        }
    }, [fullUserDetailsData, fullProviderDetailsData]);

    const handleShowDetails = (target) => {
        setDetailsVisible(true);
        setViewTarget(target);

        if (target?.role === "user") {
            setUserId(target?._userId)

            setFullUserDetails(null)
            setFullUserDetails(fullUserDetailsData)
        };
        if (target?.role === "provider") {
            setProviderId(target?._userId)
            setFullUserDetails(null)
            setFullUserDetails(fullProviderDetailsData)
        };
    };

    const handleBack = () => {
        setDetailsVisible(false);
        setViewTarget(null);
        setFullUserDetails(null);
    };

    return (
        <section className={`p-5 ${detailsVisible && "flex gap-5 items-start lg:flex-nowrap flex-wrap"}`}>
            {/* Summary Section */}
            <div className="border border-gray-200 p-5 rounded-lg w-full">
                <div className="flex items-center justify-between mb-8">
                    <Link to={'/work-traker'} className="text-3xl font-semibold flex items-center gap-2"><FaArrowLeft /> Work Tracker</Link>
                    <span
                        className={`py-1 px-3 rounded-lg text-white ${workData.status === "Completed"
                            ? "bg-green-500"
                            : workData.status === "In Progress"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                    >
                        {workData.status}
                    </span>
                </div>

                <h2 className="border p-2 rounded-lg text-xl font-semibold bg-blue-100 mb-5">
                    Proof of work complete information
                </h2>

                <h2 className="border p-2 rounded-lg text-xl font-semibold bg-blue-100 mb-5">
                    Services Booking Information
                </h2>

                <div className="border p-5 rounded-lg flex flex-wrap gap-5 justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Booking Order Date & Time</h2>
                        <span className="flex items-center gap-2 text-gray-600">
                            <IoTime className="text-[#778aebe0]" /> {moment(fullCompletedData?.serviceBooking?.bookingDateTime).format("MMM DD, YYYY hh:mm A")}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Duration Time</h2>
                        <span className="flex items-center gap-2 text-gray-600">
                            <IoTime className="text-[#778aebe0]" /> {fullCompletedData?.serviceBooking?.duration} day
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Completion Date & Time</h2>
                        <span className="flex items-center gap-2 text-gray-600">
                            <IoTime className="text-[#778aebe0]" /> {moment(fullCompletedData?.serviceBooking?.completionDateTime).format("MMM DD, YYYY hh:mm A")}
                        </span>
                    </div>
                </div>

                <div className="border-t-2 border-b-2 border-dashed border-gray-300 my-5 py-2">
                    <h2 className="text-xl font-semibold mb-2">Working Address</h2>
                    <span className="flex items-center gap-2 text-gray-600">
                        <IoLocationSharp className="text-[#778aebe0] text-2xl" /> {fullCompletedData?.serviceBooking?.address?.en}
                    </span>
                </div>

                <div className="border p-3 rounded-lg">
                    <h2 className="mb-2 text-xl font-semibold">Proof of work</h2>
                    <div className="space-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {
                            fullCompletedData?.serviceBooking?.attachments?.map((img, idx) => (
                                img?.attachmentType === "image" ?
                                    <Image
                                        key={idx}
                                        className="w-full  rounded-lg"
                                        src={img?.attachment?.includes('amazonaws') ? img?.attachment : Url + img?.attachment}
                                        alt="Proof"
                                    />
                                    :
                                    <iframe src={img?.attachment?.includes('amazonaws') ? img?.attachment : Url + img?.attachment} width="100%" frameBorder="0" key={idx}></iframe>
                            ))
                        }
                    </div>
                </div>

                <div className="border p-3 my-5 rounded-lg">
                    <h2 className="mb-2 text-xl font-semibold">Services Payment Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between bg-blue-100 p-2 rounded-lg">
                            <span className="font-medium text-base">Initial Cost</span>
                            <span>
                                Start from: <span className="text-[#778aebe0] font-bold text-xl">৳{fullCompletedData?.serviceBooking.startPrice}</span>
                            </span>
                        </div>
                        {
                            fullCompletedData?.additionalCosts?.map((s, index) => (
                                <div key={index} className="flex justify-between bg-blue-100 p-2 rounded-lg">
                                    <span className="font-medium text-base">{s.costName}</span>
                                    <span className="text-[#778aebe0] font-bold text-xl">৳{s.price}</span>
                                </div>
                            ))
                        }
                        <hr />
                        <div className="flex justify-between bg-green-100 p-2 rounded-lg">
                            <span className="font-medium text-base">Sub Total Cost</span>
                            <span className="text-[#778aebe0] font-bold text-xl">৳{fullCompletedData?.serviceBooking?.totalCost}</span>
                        </div>
                        <div className="flex justify-between bg-blue-100 p-2 rounded-lg">
                            <span className="font-medium text-base">Admin Percentage Of Start Price</span>
                            <span className="text-[#778aebe0] font-bold text-xl">-৳{fullCompletedData?.serviceBooking?.adminPercentageOfStartPrice.toFixed(2) || 0}</span>
                        </div>
                        <div className="flex justify-between bg-green-100 p-2 rounded-lg">
                            <span className="font-semibold text-xl">Total Cost</span>
                            <span className="text-[#778aebe0] font-bold text-xl">৳{fullCompletedData?.serviceBooking?.totalCost - fullCompletedData?.serviceBooking?.adminPercentageOfStartPrice || 0}</span>
                        </div>
                    </div>
                </div>

                {/* User and Provider */}
                {["user", "provider"].map((role) => {
                    const person = workData[role];
                    const personRole = role === "user" ? fullCompletedData?.serviceBooking?.userId : fullCompletedData?.serviceBooking?.providerId;
                    return (
                        <div key={role}>
                            <div
                                className="flex items-center gap-5 my-5 border p-3 rounded-lg cursor-pointer"
                                onClick={() => handleShowDetails(personRole)}
                            >
                                <img
                                    className="w-20 h-20 rounded-full"
                                    src={personRole?.profileImage?.imageUrl.includes('amazonaws') ? personRole.profileImage?.imageUrl : Url + personRole?.profileImage?.imageUrl}
                                    alt={personRole?.name}
                                />
                                <div>
                                    <h2 className="text-2xl font-semibold">{personRole?.name}</h2>
                                    <h2 className="text-xl font-medium text-gray-500">{role === "user" ? "User" : "Provider"}</h2>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Details Drawer */}
            {fullUserDetails && (
                <div className="w-full lg:w-2/5 border-2 border-blue-400 p-4 rounded-lg relative">

                    <div
                        onClick={handleBack}
                        className="absolute bg-[#778aebe0] p-3 rounded-full -top-5 -left-5 cursor-pointer"
                    >
                        <FaArrowLeft className="text-white text-xl" />
                    </div>
                    <div className="flex items-center gap-5 mb-5">
                        <Image
                            className="max-w-20 max-h-20 w-full h-full rounded-full"
                            src={fullUserDetails?.profileImage?.imageUrl.includes('amazonaws') ? fullUserDetails.profileImage?.imageUrl : Url + fullUserDetails?.profileImage?.imageUrl}
                            alt={fullUserDetails?.name}
                        />
                        <div>
                            <h1 className="text-2xl font-semibold">{fullUserDetails?.name}</h1>
                            <span>{fullUserDetails?.role === "user" ? "User" : "Provider"}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <InfoRow label="Name" value={fullUserDetails?.name} />
                        <InfoRow label="Work Type" value={fullUserDetails?.serviceName?.en || "N/A"} />
                        {fullUserDetails.experience && (
                            <InfoRow label="Years of Experience" value={fullUserDetails?.experience || "N/A"} />
                        )}
                        <InfoRow label="Email" value={fullUserDetails?.email} />
                        <InfoRow label="Phone Number" value={fullUserDetails?.phoneNumber || "N/A"} />
                        <InfoRow label="Gender" value={fullUserDetails?.gender || "N/A"} />
                        <InfoRow label="Date of Birth" value={moment(fullUserDetails?.dob).format("DD MMM YYYY")} />
                        <InfoRow label="Address" value={fullUserDetails?.location?.en || "N/A"} />
                    </div>
                </div>
            )}
        </section>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border p-2 rounded-lg border-gray-300">
        <span className="font-semibold">{label}</span>
        <span>{value}</span>
    </div>
);

export default WorkTrakercompleted;
