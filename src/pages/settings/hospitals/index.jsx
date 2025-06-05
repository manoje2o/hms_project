import React, { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
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
  Upload,
  Avatar,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import axios from "../../../Axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { FaFileExport } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { notification } from "antd";
import { showSuccessToast } from "../../../utils/toastutils";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import Logoupload from "../../../components/Logoupload";
import { label } from "framer-motion/client";

const { Option } = Select;

const HospitalPage = () => {
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
  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState(null);
  const BASE_URL = "https://e2otech-001-site1.ltempurl.com/api/hospital/GetByIdLogo"; // or your actual domain

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/Hospital/GetAllHospitals");
      setPatients(response.data);
    } catch (err) {
      setError("Failed to fetch patient data");
    } finally {
      setLoading(false);
    }
  };
  console.log("patients", patients);

  useEffect(() => {
    fetchPatients();
  }, []);

  const [logo, setLogo] = useState(null);
  const handleView = async (record) => {
    try {
      const [response, responseLogo] = await Promise.all([
        axios.get(`/Hospital/GetHospitalById/${record.hospitalId}`),
        axios
          .get(`/hospital/GetByIdLogo/${record.hospitalId}`)
          .then((res) => {
            console.log("Logo response:", res.data.logoPath);
            const img =  res.data?.logoPath || null;
            setLogo(img); // ✅ Set logo directly
          })
          .catch(() => null),
      ]);

      setViewPatient(response.data);
      // setLogo(responseLogo); // ✅ Use directly here
      setIsOpenView(true);
    } catch (error) {
      console.error("Failed to fetch hospital details or logo:", error);
      message.error("Unable to load hospital data.");
    }
  };

  const handleEdit = (record) => {
    setEditingPatient(record);
    console.log("editingPatient", record);

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
      await axios.delete(`/Hospital/DeleteHospital/${record.hospitalId}`);
      notification.success({
        message: "Deleted Successfully",
        description: `Patient "${record.hospitalName}" has been removed.`,
      });
      showSuccessToast(`${record.hospitalName} deleted successfully!`);

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
      title: "Hospital ID",
      dataIndex: "hospitalID",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Hospital code",
      dataIndex: "hospitalCode",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Hospital Name",
      dataIndex: "hospitalName",
      key: "hospitaName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    // {
    //   title: "Gender",
    //   dataIndex: "gender",
    //   key: "gender",
    //   filters: [
    //     { text: "Male", value: "Male" },
    //     { text: "Female", value: "Female" },
    //     { text: "Other", value: "Other" },
    //   ],
    //   onFilter: (value, record) => record.gender === value,
    //   sorter: (a, b) => a.gender.localeCompare(b.gender),
    // },
    // {
    //   title: "Date of Birth",
    //   dataIndex: "dateOfBirth",
    //   key: "dateOfBirth",
    //   render: (date) => new Date(date).toLocaleDateString(),
    //   sorter: (a, b) =>
    //     new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
    // },
    // {
    //   title: "Age",
    //   dataIndex: "age",
    //   key: "age",
    //   sorter: (a, b) => a.age - b.age,
    // },
    {
      title: "Telephone",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
  const [imageUrl, setImageUrl] = useState(null);

  const handleChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      // Show preview instantly (base64) – for demo purpose
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageUrl(reader.result));
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const onFinish = async (values) => {
    const hospitalDto = {
      ...values,
      createdAt: new Date().toISOString(),
      createdBy: 1,
      logo: uploadedLogoUrl,
    };

    try {
      if (editingPatient) {
        console.log("editingPatient", editingPatient);

        await axios.put(
          `/Hospital/UpdateHospital/${editingPatient.hospitalId}`,
          hospitalDto
        );
        showSuccessToast("Patient updated successfully!");
        fetchPatients();
      } else {
        await axios.post("/Hospital/AddHospital", hospitalDto); // ✅ Fix here
        showSuccessToast("Hospital added successfully!"); // ✅ Fix here
        fetchPatients();
      }

      form.resetFields();
      setIsopen(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      console.error("Submission error:", error);
      message.error("Failed to submit data.");
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

  const filteredPatients = patients.filter(
    (patient) =>
      patient.hospitalName?.toLowerCase().includes(searchText.toLowerCase()) ||
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

  // logo uplaod  in edit form
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error("You can only upload image files!");
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }

    return isImage && isLt2M; // ✅ prevents upload when false
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    if (!editingPatient?.hospitalId) {
      message.error("Hospital not selected yet. Cannot upload.");
      return onError("Hospital ID missing");
    }

    const formData = new FormData();
    formData.append("logoPath", file);

    try {
      const res = await axios.post(
        `/Hospital/UploadLogo/${editingPatient.hospitalId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadedLogoUrl(res.data?.url);
      onSuccess("OK");
      message.success("Logo uploaded");
    } catch (error) {
      console.error("Upload error", error);
      message.error("Upload failed");
      onError("Upload failed");
    }
  };

  const items = [
    {
      key: "1",
      label: editingPatient ? "Edit Details" : "Add Details",
      children: (
        <>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={handleFormChange}
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col-8">
                  <Form.Item
                    label="Hospital Name"
                    name="hospitalName"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter Hospital name" />
                  </Form.Item>
                </div>
                <div className="col-4">
                  <Form.Item
                    label="Hospital Code"
                    name="hospitalCode"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter Hospital code" />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-12">
                  <Form.Item label="Plot No." name="address">
                    <Input placeholder="Enter a address" />
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
                <div className="col-6 col-md-4">
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input
                      className="w-100"
                      placeholder="Enter email address"
                    />
                  </Form.Item>
                </div>
                <div className="col-6 col-md-4">
                  <Form.Item
                    label="Mobile"
                    name="mobileNumber"
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
                <div className="col-6 col-md-4">
                  <Form.Item label="Telephone" name="telephone">
                    <Input
                      className="w-100"
                      maxLength={10}
                      placeholder="Enter mobile number"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <Upload
                    name="logoPath"
                    listType="text"
                    maxCount={1}
                    customRequest={handleUpload} // ✅ Correct
                  >
                    <Button text={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </div>
              </div>
              <Form.Item className="text-end mt-4">
                <Button
                  loading={isSubmitting}
                  text={
                    editingPatient
                      ? "Update Hospital Info"
                      : "Submit Hospital Info"
                  }
                  variant="primary"
                  htmlType="submit"
                />
              </Form.Item>
            </div>
          </Form>
        </>
      ),
    },
    {
      key: "2",
      label: " Logo Upload",
      children: <Logoupload logoDetail={patients} />,
    },
  ];

  const getHospitalLogo = async (hospitalId) => {
    console.log("editingPatient", viewPatient.hospitalId);

    try {
      const res = await axios.get(
        `/hospital/GetByIdLogo/${viewPatient.hospitalId}`
      );
      setLogoUrl(res.data);
    } catch (err) {
      console.error("Failed to fetch logo:", err);
      return null;
    }
  };

  return (
    <div className="bg-white mx-3 my-4 px-3 px-md-4 py-4 py-md-5 rounded-4 shadow-sm border">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 border-bottom pb-3 gap-3">
        <h2 className="mb-0 text-dark fw-serif fw-bold">
          👩‍⚕️ Hospitals Managements
        </h2>
        <Button
          text="Add a Hospitals"
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

          <div className="d-flex gap-2">
            {/* <Button
      text="Export PDF"
      variant="secondary"
      onClick={() => exportPDF(filteredPatients)}
    /> */}
          </div>

          <Table
            columns={columns}
            dataSource={[...filteredPatients].reverse()} // ← call reverse on a copy
            rowKey="patientID"
            bordered
            pagination={{ pageSize: 4 }}
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
        title={editingPatient ? "Edit Hospital" : "Add Hospital"}
        width={800}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
      {isOpenView && (
        <Modal
          open={true}
          onCancel={() => setIsOpenView(false)}
          footer={null}
          centered
        >
          <div
            className="text-center mb-4"
            style={{
              maxWidth: "500px",
              margin: "30px auto",
              padding: "25px 30px",
              border: "2px solid #0d6efd",
              borderRadius: "15px",
              backgroundColor: "#f0f8ff",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              fontFamily: "Segoe UI, sans-serif",
            }}
          >
            <img
              src={logo ? "/default-logo.png" : `${BASE_URL}${logo}`  }
              alt="Hospital Logo"
              style={{ width: 50, height: 50 }}
            />

            <h2
              style={{
                marginBottom: "10px",
                color: "#0d6efd",
                fontWeight: "bold",
                fontSize: "28px",
              }}
            >
              {viewPatient?.hospitalName || "Hospital Name"}
            </h2>
            <p style={{ margin: 0, fontSize: "16px", color: "#333" }}>
              {viewPatient?.address || "Address not available"} <br />
              Contact: {viewPatient?.mobileNumber || "N/A"}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HospitalPage;
