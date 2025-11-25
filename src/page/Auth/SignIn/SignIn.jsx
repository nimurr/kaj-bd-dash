import signinImage from "/public/Auth/login.png";
import authLogo from "../../../assets/auth/auth-logo.png";
import logoimage from '/public/logo/Logo-Orange.png';

import { Link, useNavigate } from "react-router-dom";
import { Form, Checkbox } from "antd";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import CustomButton from "../../../utils/CustomButton";
import CustomInput from "../../../utils/CustomInput";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { loggedUser } from "../../../redux/features/auth/authSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const handleSubmit = async (values) => {
    const { email, password } = values;
    const data = {
      email, password
    }
    try {
      const res = await login(data).unwrap();
      console.log(res?.data?.attributes?.userWithoutPassword);

      
      if (res.error) {
        toast.error(res.error.data.message || "Something went wrong");
        console.log(res.error.data.message);
      }
      if (res) {
        localStorage.setItem("token", res?.data?.attributes?.tokens?.accessToken);
        localStorage.setItem("user", JSON.stringify(res?.data?.attributes?.userWithoutPassword));
        dispatch(
          loggedUser({
            token: res?.token
          })
        );
        toast.success(res?.message);
        navigate("/");
      }


    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full  h-full md:h-screen md:flex justify-around overflow-visible">
      <div className="md:w-[600px] mx-5 border-shadow rounded-md h-[70%] my-10 md:my-28 place-content-center md:px-5 px-2 md:py-5 py-5 gap-8 bg-white md:mx-10">
        <div className="md:px-8 px-3">
          <div className="mb-8">
            <img src={logoimage} className="w-[100px] rounded-full border-shadow h-[100px] mx-auto mb-10" alt="" />
            <h1 className="font-semibold text-3xl text-gray-800">
              Hello, Welcome!
            </h1>
            <p className="text-gray-500">
              Please Enter Your Details Below to Continue
            </p>
          </div>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
              ]}
            >
              <CustomInput
                type="email"
                icon={HiOutlineMail}
                placeholder={"Enter Email"}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <CustomInput
                type="password"
                icon={HiOutlineLockClosed}
                placeholder={"Enter password"}
                isPassword
              />
            </Form.Item>

            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/auth/forget-password" className="underline">
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <button loading={isLoading} className="w-full bg-[#778beb] text-xl font-semibold text-white  rounded-md py-2" border={true}>
                Login
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
