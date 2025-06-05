import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Modal from "antd/es/modal/Modal";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Table,
  Spin,
  Alert,
} from "antd";
import dayjs from "dayjs";
import axios from "../../Axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { FaFileExport } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { notification } from "antd";
import { showSuccessToast } from "../../utils/toastutils";

const { Option } = Select;

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsopen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [viewPatient, setViewPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/patient/GetPatientsDetails");
      setPatients(response.data);
    } catch (err) {
      setError("Failed to fetch patient data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

   
  const handleView = async (record) => {
    try {
      const patiendGetid = await axios.get(
        `/patient/GetPatientById/${record.patientID}`
      );
      setViewPatient(patiendGetid.data);
      setIsModalOpen(true); // Show modal after data is loaded
    } catch (error) {
      console.error("Failed to fetch patient:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingPatient(record);
    form.setFieldsValue({
      ...record,
      dateOfBirth: dayjs(record.dateOfBirth),
    });
    setIsopen(true);
  };

  const handleDelete = async (record) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete patient "${record.fullName}"?`
    );
    if (!confirmDelete) return;

    try {
      setIsSubmitting(true);
      await axios.delete(`/patient/DeletePatientById/${record.patientID}`);
      notification.success({
        message: "Deleted Successfully",
        description: `Patient "${record.fullName}" has been removed.`,
      });
      showSuccessToast("Patient deleted successfully!");

      fetchPatients();
    } catch (error) {
      notification.error({
        message: "Deletion Failed",
        description: "Could not delete the patient. Try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "patientID",
      key: "patientID",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value, record) => record.gender === value,
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      sorter: (a, b) => a.mobileNumber.localeCompare(b.mobileNumber),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleView(record)}
          >
            View
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(record)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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

  const filteredPatients = patients.filter((patient) =>
      patient.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.mobileNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.gender?.toLowerCase().includes(searchText.toLowerCase())
  );
  const exportCSV = (data) => {
    const csv = Papa.unparse(
      data.map((patient) => ({
        Name: patient.fullName,
        Gender: patient.gender,
        Age: patient.age,
        Email: patient.email,
        Mobile: patient.mobileNumber,
        DOB: new Date(patient.dateOfBirth).toLocaleDateString(),
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "patients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportPDF = (data) => {
    const doc = new jsPDF();

    doc.text("Patient Report", 14, 15);

    const tableData = data.map((patient) => [
      patient.fullName,
      patient.gender,
      patient.age,
      patient.email,
      patient.mobileNumber,
      new Date(patient.dateOfBirth).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [["Name", "Gender", "Age", "Email", "Mobile", "DOB"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 9 },
    });

    doc.save("patients.pdf");
  };

  return (
    <div className="bg-white mx-3 my-4 px-3 px-md-4 py-4 py-md-5 rounded-4 shadow-sm border">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 border-bottom pb-3 gap-3">
        <h2 className="mb-0 text-dark fw-serif fw-bold">
          👩‍⚕️ Patient Managements
        </h2>
        <Button
          text="Add a Patient"
          variant="primary"
          className="rounded-pill px-4 fw-medium"
          onClick={() => {
            setEditingPatient(null);
            form.resetFields();
            setIsopen(true);
          }}
        />
      </div>
      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon className="rounded-3" />
      ) : (
        <div className="table-responsive  ">
          <div
            className="d-flex justify-content-end mb-3"
            style={{ width: "100%" }}
          >
            <AnimatePresence>
              {isShowSearch && (
                <motion.input
                  key="search"
                  type="text"
                  placeholder="Search patients..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-400 px-3 py-2 rounded-md w-full"
                />
              )}
            </AnimatePresence>

            <Button
              text={<FaSearch />}
              variant="secondary"
              onClick={() => setIsShowSearch(!isShowSearch)}
              className="mx-2"
            />
            <Button
              text={<FaFileExport />}
              variant="secondary"
              onClick={() => exportCSV(filteredPatients)}
            />
          </div>

          

          <Table
            columns={columns}
            dataSource={[...filteredPatients].reverse()} // good
            rowKey="patientID" // ensure this key exists and is unique
            bordered
            pagination={{ pageSize: 5 }}
            className="custom-patient-table"
            // scroll={{ x: "max-content" }}
          />
        </div>
      )}
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
                loading={isSubmitting}
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
      <Modal
        title="Patient Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {viewPatient ? (
          <div>
            <p>
              <strong>ID:</strong> {viewPatient.patientID}
            </p>
            <p>
              <strong>Name:</strong> {viewPatient.fullName}
            </p>
            <p>
              <strong>Date of Birth :</strong> {viewPatient.dateOfBirth}
            </p>
            <p>
              <strong>Age:</strong> {viewPatient.age}
            </p>
            <p>
              <strong>Blood Group:</strong> {viewPatient.bloodGroup}
            </p>
            <p>
              <strong>Marital status:</strong> {viewPatient.maritalStatus}
            </p>
            <p>
              <strong>Occupation:</strong> {viewPatient.occupation}
            </p>
            <p>
              <strong>weight:</strong> {viewPatient.weightKg}
            </p>
            <p>
              <strong>Height:</strong> {viewPatient.heightCm}
            </p>
            <p>
              <strong>Bmi:</strong> {viewPatient.bmi}
            </p>
            <p>
              <strong>Mobile No:</strong> {viewPatient.mobileNumber}
            </p>
            <p>
              <strong>Email id:</strong> {viewPatient.email}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {[
                viewPatient.plotNo,
                viewPatient.streetAddress,
                viewPatient.city,
                viewPatient.state,
                viewPatient.country,
              ]
                .filter(Boolean)
                .join(", ")}{" "}
              {viewPatient.pincode && `- ${viewPatient.pincode}`}
            </p>

            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default PatientPage;
