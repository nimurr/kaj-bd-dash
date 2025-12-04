import otpImage from "/public/Auth/otp.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import authLogo from "../../../assets/auth/auth-logo.png";
import { IoIosArrowBack } from "react-icons/io";
import OTPInput from "react-otp-input";
import { useState } from "react";
import CustomButton from "../../../utils/CustomButton";
import {
  useForgotPasswordMutation,
  useVerifyEmailMutation,
} from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import logoimage from '/public/logo/main_logo.png';


const Otp = () => {
  const [otp, setOtp] = useState("");
  const { email } = useParams();
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading }] = useVerifyEmailMutation();
  const handleOtpChange = (otpValue) => {
    setOtp(otpValue);
  };
  const handleMatchOtp = async () => {
    try {
      const res = await verifyOtp({
        otp
      }).unwrap();
      console.log(res);
      if (res.error) {
        toast.error(res?.error?.data?.message);
      }
      if (res) {
        localStorage.setItem("jwtToken", res?.changePasswordToken);
        toast.success(res?.data?.message);
        navigate(`/auth/new-password/${email}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleResendPassword = async () => {
    try {
      const res = await forgotPassword({ email });
      if (res.error) {
        toast.error(res?.error?.data?.message);
        console.log(res.error);
      }
      if (res.data) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="w-full  h-full md:h-screen md:flex justify-around ">
      {/* <img
          src={authLogo}
          className="w-[147px] h-[152px] mx-auto md:my-20 md:mx-5"
          alt="Sign in illustration"
    /> */}
      <div className="w-full md:w-[600px] mx-auto border-shadow rounded-md h-[60%] md:my-28 place-content-center px-5 py-15 gap-8 bg-white md:mx-10 ">

        <div className="">
          <div className="mb-5 space-y-5">
             <img src={logoimage} className="w-[100px] rounded-full shadow-xl h-[100px] mx-auto mb-5" alt="" />
            <h1 className="font-semibold text-xl flex items-center gap-2">
              <Link to="/auth/login">
                <IoIosArrowBack />
              </Link>
              Verify
            </h1>
            <h1>{`We'll send a verification code to your email. Check your inbox and enter the code here.`}</h1>
          </div>
          <OTPInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            containerStyle="otp-container"
            inputStyle={{
              width: "100%",
              maxWidth: "6.5rem",
              height: "3rem",
              margin: "0 0.5rem",
              fontSize: "2rem",
              fontWeight: "bold",
              borderBottom: "1px solid #4E4E4E",
              textAlign: "center",
              outline: "none",
            }}
          />
          <div onClick={handleMatchOtp} className="mt-5">
            <button className="w-full bg-[#778beb] text-xl font-semibold text-white rounded-md py-2" loading={isLoading} border >
              Verify
            </button>
          </div>
          <div className="flex justify-between items-center my-4">
            <h1>Didn’t receive code?</h1>
            <button onClick={handleResendPassword} className="text-[#778beb]">
              Verify Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
