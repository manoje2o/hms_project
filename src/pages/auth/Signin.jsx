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

const { Title, Text } = Typography;

const Signin = () => {
  const [form] = Form.useForm(); // AntD Form instance
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);

  const navigate = useNavigate();

  const resetStates = () => {
    setEmail("");
    setPassword("");
    setRemember(false);
    setForgetPassword(false);
    setShowOtpInput(false);
    setEmailDisabled(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (forgetPassword) {
      if (!values.otp) {
        message.error("Please enter the OTP!");
        return;
      }
      message.success("OTP Verified!");
      resetStates();
      navigate("/dashboard");
    } else {
      const { email, password, remember } = values;
      message.success("Login successful!");
      resetStates();
      navigate("/dashboard");
    }
  };

  const handleGetOtp = () => {
    setShowOtpInput(true);
    setEmailDisabled(true);
    const currentEmail = form.getFieldValue("email");
    if (!currentEmail) {
      message.warning("Please enter your email before requesting OTP.");
      return;
    }
    message.success(`OTP sent to ${currentEmail}`);
    setShowOtpInput(true);
    setEmailDisabled(true);
  };
  const options = [
    { value: "option1", label: "PKN Hospital" },
    { value: "option2", label: "Meenakshi Hospital" },
    { value: "option3", label: "E2o Hospital" },
  ];
  const role = [
    { value: "Admin", label: "Admin" },
    { value: "Nurse", label: "Nurse" },
    { value: "Doctor", label: "Doctor" },
  ];

  return (
    <div className="d-flex bg-secondary align-items-center justify-content-center min-vh-100">
      <div
        className="card p-4 shadow rounded"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <Title level={3} className="text-center" style={{ marginBottom: 30 }}>
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          {!forgetPassword && (
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
                <Select placeholder="Select a value">
                  {options.map((option) => (
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
                <Select placeholder="Select a value">
                  {role.map((option) => (
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
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form.Item>
            </>
          )}

          {forgetPassword && (
            <>
              {!showOtpInput ? (
                <Button
                  type="link"
                  block
                  onClick={handleGetOtp}
                  style={{
                    color: "blue",
                    display: "block",
                    cursor: "pointer",
                    textAlign: "right",
                  }}
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
                    <Button type="primary" htmlType="submit" block>
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
                  setForgetPassword(false);
                  setShowOtpInput(false);
                  setEmailDisabled(false);
                  form.resetFields();
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
  );
};

export default Signin;
