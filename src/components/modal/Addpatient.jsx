import React,{useState} from 'react'
import Button from "../button/Button";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Modal
  
} from "antd";
import dayjs from "dayjs";
import axios from "../../Axios";
import { showSuccessToast } from "../../utils/toastutils";
const { Option } = Select;

const Addpatient = () => {
    const [isOpen, setIsopen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
      const [isSubmitting, setIsSubmitting] = useState(false);
 
    const [form] = Form.useForm();
     const handleFormChange = (changedValues, allValues) => {
        if (changedValues.dateOfBirth) {
          const today = dayjs();
          const age = today.diff(changedValues.dateOfBirth, "year");
          form.setFieldsValue({ age });
        }
    
        if (changedValues.weightKg || changedValues.heightCm) {
          const weight = allValues.weightKg;
          const height = allValues.heightCm;
    
          if (weight && height) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            form.setFieldsValue({ bmi: Number(bmi.toFixed(2)) });
          }
        }
      };
      const onFinish = async (values) => {
    const formattedData = {
      ...values,
      dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    try {
      if (editingPatient) {
        await axios.put(
          `/patient/EditPatientDetails/${editingPatient.patientID}`,
          formattedData
        );
        showSuccessToast("Patient updated successfully!");
        fetchPatients();
      } else {
        await axios.post("/patient/AddNewPatient", formattedData);
        fetchPatients();
        showSuccessToast("Patient updated successfully!");
      }

      form.resetFields();
      setIsopen(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      message.error("Failed to submit patient data.");
    }
  };

  return (
    <div>
        <Button text='add patient' type='primary' className='w-full mt-4' onClick={() =>setIsopen(true)}/>
          <Modal
                open={isOpen}
                onCancel={() => {
                  setIsopen(false);
                  setEditingPatient(null);
                  form.resetFields();
                }}
                footer={null}
                title={editingPatient ? "Edit Patient" : "Add Patient"}
                width={800}
                bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  onValuesChange={handleFormChange}
                >
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          label="Full Name"
                          name="fullName"
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Enter full name" />
                        </Form.Item>
                      </div>
                    </div>
        
                    <div className="row">
                      <div className="col-12 col-md-4">
                        <Form.Item
                          label="Gender"
                          name="gender"
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="Select gender">
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                            <Option value="Other">Other</Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-6 col-md-4">
                        <Form.Item
                          label="Date of Birth"
                          name="dateOfBirth"
                          rules={[{ required: true }]}
                        >
                          <DatePicker
                            className="w-100"
                            placeholder="Select date of birth"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-6 col-md-4">
                        <Form.Item label="Age" name="age">
                          <InputNumber
                            min={0}
                            className="w-100"
                            disabled
                            placeholder="Auto calculated"
                          />
                        </Form.Item>
                      </div>
                    </div>
        
                    <div className="row">
                      <div className="col-12 col-md-4">
                        <Form.Item label="Blood Group" name="bloodGroup">
                          <Select placeholder="Select blood group" allowClear>
                            <Option value="A+">A+</Option>
                            <Option value="A-">A-</Option>
                            <Option value="B+">B+</Option>
                            <Option value="B-">B-</Option>
                            <Option value="AB+">AB+</Option>
                            <Option value="AB-">AB-</Option>
                            <Option value="O+">O+</Option>
                            <Option value="O-">O-</Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="Marital Status" name="maritalStatus">
                          <Select placeholder="Select marital status">
                            <Option value="Single">Single</Option>
                            <Option value="Married">Married</Option>
                            <Option value="Divorced">Divorced</Option>
                            <Option value="Widowed">Widowed</Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="Occupation" name="occupation">
                          <Select placeholder="Select occupation">
                            <Option value="Student">Student</Option>
                            <Option value="Engineer">Engineer</Option>
                            <Option value="Doctor">Doctor</Option>
                            <Option value="Teacher">Teacher</Option>
                            <Option value="Business">Business</Option>
                            <Option value="Government Employee">
                              Government Employee
                            </Option>
                            <Option value="Private Sector">Private Sector</Option>
                            <Option value="Unemployed">Unemployed</Option>
                            <Option value="Other">Other</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
        
                    <div className="row">
                      <div className="col-12 col-md-4">
                        <Form.Item label="Plot No." name="plotNo">
                          <Input placeholder="Enter plot number" />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="Street Address" name="streetAddress">
                          <Input placeholder="Enter street address" />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="City" name="city">
                          <Input placeholder="Enter city" />
                        </Form.Item>
                      </div>
                    </div>
        
                    <div className="row">
                      <div className="col-12 col-md-4">
                        <Form.Item label="State" name="state">
                          <Input placeholder="Enter state" />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="Country" name="country">
                          <Input placeholder="Enter country" />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="Pincode" name="pincode">
                          <Input placeholder="Enter pincode" />
                        </Form.Item>
                      </div>
                    </div>
        
                    <div className="row">
                      <div className="col-12 col-md-4">
                        <Form.Item label="Weight (kg)" name="weightKg">
                          <InputNumber
                            min={0}
                            className="w-100"
                            placeholder="Enter weight in kg"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="Height (cm)" name="heightCm">
                          <InputNumber
                            min={0}
                            className="w-100"
                            placeholder="Enter height in cm"
                          />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-4">
                        <Form.Item label="BMI" name="bmi">
                          <InputNumber
                            min={0}
                            className="w-100"
                            disabled
                            placeholder="Auto calculated"
                          />
                        </Form.Item>
                      </div>
                    </div>
        
                    <div className="row">
                      <div className="col-6 col-md-6">
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            { type: "email", message: "Please enter a valid email" },
                          ]}
                        >
                          <Input className="w-100" placeholder="Enter email address" />
                        </Form.Item>
                      </div>
                      <div className="col-6 col-md-6">
                        <Form.Item
                          label="Mobile"
                          name="MobileNumber"
                          rules={[
                            {
                              pattern: /^\d{10}$/,
                              message: "Enter a valid 10-digit mobile number",
                            },
                          ]}
                        >
                          <Input
                            className="w-100"
                            maxLength={10}
                            placeholder="Enter mobile number"
                          />
                        </Form.Item>
                      </div>
                    </div>
        
                    <Form.Item className="text-end mt-4">
                      <Button
                        text={
                          editingPatient ? "Update Patient Info" : "Submit Patient Info"
                        }
                        variant="primary"
                        htmlType="submit"
                      />
                    </Form.Item>
                  </div>
                </Form>
              </Modal>
    </div>
  )
}

export default Addpatient