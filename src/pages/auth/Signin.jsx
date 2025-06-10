import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  message,
  Select,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import spaLogo1 from "../../assets/spaLogo1.png";

const { Title, Text } = Typography;

const Signin = () => {
  const [form] = Form.useForm();
  const [forgetPassword, setForgetPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);

  const navigate = useNavigate();

  const resetStates = () => {
    setForgetPassword(false);
    setShowOtpInput(false);
    setEmailDisabled(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    console.log("button clicked", values);

    if (forgetPassword) {
      if (!values.otp) {
        message.error("Please enter the OTP!");
        return;
      }
      message.success("OTP Verified!");
      resetStates();
      navigate("/dashboard");
    } else {
      const { email, password, hospitalName, role } = values;
      if (!email || !password || !hospitalName || !role) {
        message.error("Please fill all required fields.");
        return;
      }
      message.success("Login successful!");
      resetStates();
      navigate("/dashboard");
    }
  };

  const handleGetOtp = () => {
    const currentEmail = form.getFieldValue("email");
    if (!currentEmail) {
      message.warning("Please enter your email before requesting OTP.");
      return;
    }
    message.success(`OTP sent to ${currentEmail}`);
    setShowOtpInput(true);
    setEmailDisabled(true);
  };

  const hospitalOptions = [
    { value: "option1", label: "PKN Hospital" },
    { value: "option2", label: "Meenakshi Hospital" },
    { value: "option3", label: "E2o Hospital" },
  ];

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Nurse", label: "Nurse" },
    { value: "Doctor", label: "Doctor" },
  ];

  return (
    <div
      className="d-flex min-vh-100"
      style={{ background: "linear-gradient(108deg, white 10%, #0D5C63 90%)" }}
    >
      {/* Left branding */}
      <div
        className="d-none d-md-flex flex-column justify-content-center align-items-center text-center p-4"
        style={{ width: "50%" }}
      >
        <img
          src={spaLogo1}
          alt="SPA Logo"
          style={{ width: "200px", height: "200px", objectFit: "contain" }}
        />
        <div style={{ color: "#0D5C63" }}>
          <h2 className="fw-bold">Your Health, Our Priority</h2>
          <p>Empowering Care with Technology</p>
        </div>
      </div>

      {/* Right login form */}
      <div className="d-flex align-items-center justify-content-center w-100">
        <div
          className="card p-4 shadow rounded"
          style={{
            maxWidth: 400,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Title
            level={3}
            className="text-center"
            style={{ marginBottom: 30, color: "#1e88e5" }}
          >
            {forgetPassword ? "Reset Password" : "Login"}
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                type="email"
                placeholder="example@email.com"
                disabled={emailDisabled}
              />
            </Form.Item>

            {!forgetPassword ? (
              <>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                  ]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item
                  label="Hospital Name"
                  name="hospitalName"
                  rules={[{ required: true, message: "Please select a value!" }]}
                >
                  <Select placeholder="Select hospital">
                    {hospitalOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Please select a value!" }]}
                >
                  <Select placeholder="Select role">
                    {roleOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                      backgroundColor: "#0D5C63",
                      borderColor: "#1e88e5",
                    }}
                  >
                    Login
                  </Button>
                </Form.Item>
              </>
            ) : (
              <>
                {!showOtpInput ? (
                  <Button
                    type="link"
                    block
                    onClick={handleGetOtp}
                    style={{ color: "blue", textAlign: "right" }}
                  >
                    Get OTP
                  </Button>
                ) : (
                  <>
                    <Form.Item
                      label="Enter OTP"
                      name="otp"
                      rules={[
                        { required: true, message: "Please enter the OTP!" },
                      ]}
                    >
                      <Input placeholder="Enter OTP" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{
                          backgroundColor: "#1e88e5",
                          borderColor: "#1e88e5",
                        }}
                      >
                        Verify OTP
                      </Button>
                    </Form.Item>
                  </>
                )}
                <Text
                  style={{
                    color: "blue",
                    display: "block",
                    cursor: "pointer",
                    textAlign: "right",
                  }}
                  onClick={() => {
                    resetStates();
                  }}
                >
                  Back to Login
                </Text>
              </>
            )}

            {!forgetPassword && (
              <Text
                style={{
                  color: "blue",
                  textAlign: "right",
                  display: "block",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setForgetPassword(true);
                  setShowOtpInput(false);
                  setEmailDisabled(false);
                  form.resetFields();
                }}
              >
                Forgot Password?
              </Text>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
