import React, { useState } from "react";
import Button from "../../components/button/Button";
import {
  Form,
  Input,
  DatePicker,
  Space,
  Typography,
  Divider,
  message,
  Modal,
  Table,
  Popconfirm,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Prescriptionui from "../../components/Prescriptionui";
import Main from "../../layout/Main";

const { Title } = Typography;

const PrescriptionManagement = () => {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const onFinish = (values) => {
    const formatted = {
      ...values,
      key: editingKey !== null ? editingKey : Date.now(),
      date: values.date.format("DD-MM-YYYY"),
    };
    if (editingKey !== null) {
      setPrescriptions((prev) =>
        prev.map((p) => (p.key === editingKey ? formatted : p))
      );
      setEditingKey(null);
    } else {
      setPrescriptions((prev) => [...prev, formatted]);
    }
    form.resetFields();
    setModalOpen(false);
    message.success("Prescription submitted!");
  };

  const onEdit = (record) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date, "DD-MM-YYYY"),
    });
    setEditingKey(record.key);
    setModalOpen(true);
  };

  const onDelete = (key) => {
    setPrescriptions((prev) => prev.filter((p) => p.key !== key));
  };

  const exportPDF = () => {
    const input = document.getElementById("prescription-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("prescriptions.pdf");
    });
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    // {
    //   title: "Medications",
    //   dataIndex: "medications",
    //   key: "medications",
    //   render: (meds) => meds?.map((m, i) => (
    //     <div key={i}>
    //       <b>{m.medicine}</b>: {m.dosage}, {m.frequency}, {m.duration}, {m.instructions}<br />
    //     </div>
    //   ))
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            text="Edit"
          />
          <Button
            icon="👁️"
            onClick={() => {
              setSelectedPrescription(record);
              setViewModalOpen(true);
            }}
            text="View"
          />
          <Popconfirm
            title="Delete this prescription?"
            onConfirm={() => onDelete(record.key)}
          >
            <Button icon={<DeleteOutlined />} danger text="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  // console.log(":", prescriptions);
  console.log("Prescriptions:", selectedPrescription);
  
  return (
    // <div className="bg-white mx-3 my-4 px-3 px-md-4 py-4 py-md-5 rounded-4 shadow-sm border">
    //   <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 border-bottom pb-3 gap-3">
    //     <h2 className="mb-0 text-dark fw-serif fw-bold">
    //       👩‍⚕️ Prescription Managements
    //     </h2>
    //     <div className="d-flex gap-2">
    //       <Button
    //         text="Add a Patient"
    //         variant="primary"
    //         className="rounded-pill px-4 fw-medium"
    //         onClick={() => setModalOpen(true)}
    //       />
    //       <Button
    //         icon={<DownloadOutlined />}
    //         text="Export PDF"
    //         variant="secondary"
    //         onClick={exportPDF}
    //       />
    //     </div>
    //   </div>
      
    //   <div id="prescription-table">
    //     <Table
    //       columns={columns}
    //       dataSource={prescriptions}
    //       pagination={false}
    //     />
    //   </div>

      
    // </div>
    <>
    <Main tittle="Priscription Management" addButtonTittle="Add Priscription" columns = {columns} datasource = {prescriptions}  onClick={() => setModalOpen(true)} />
    <Modal
        open={modalOpen}
        width={800}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingKey(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          name="prescription_form"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ date: dayjs() }}
        >
          <Form.Item
            label="Patient Name"
            name="patientName"
            rules={[{ required: true, message: "Please enter patient name" }]}
          >
            <Input placeholder="Enter patient name" />
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker className="w-full" format="DD-MM-YYYY" />
          </Form.Item>

          <Divider orientation="left">Medications</Divider>

          <Form.List name="medications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline" className="flex mb-4">
                    <Form.Item
                      {...restField}
                      name={[name, "medicine"]}
                      rules={[
                        { required: true, message: "Enter medicine name" },
                      ]}
                    >
                      <Input placeholder="Medicine" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "dosage"]}
                      rules={[{ required: true, message: "Dosage required" }]}
                    >
                      <Input placeholder="Dosage (e.g. 500mg)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "frequency"]}
                      rules={[
                        { required: true, message: "Frequency required" },
                      ]}
                    >
                      <Input placeholder="e.g. 2x/day" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "duration"]}
                      rules={[{ required: true, message: "Duration required" }]}
                    >
                      <Input placeholder="e.g. 5 days" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "instructions"]}>
                      <Input placeholder="Optional instructions" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    text="Add Medicine"
                  />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full mt-4"
              text="Submit Prescription"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={viewModalOpen}
        width={800}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedPrescription(null);
        }}
        footer={null}
        title="📝 Prescription Details"
      >
        {/* {selectedPrescription && (
          <div className="p-4">
            <Title level={4}>
              Patient Name: {selectedPrescription.patientName}
            </Title>
            <p>
              <b>Date:</b> {selectedPrescription.date}
            </p>

            <Divider orientation="left">Medications</Divider>
            <ul>
              {selectedPrescription.medications?.map((med, i) => (
                <li key={i}>
                  <b>{med.medicine}</b> – {med.dosage}, {med.frequency},{" "}
                  {med.duration}
                  {med.instructions ? `, ${med.instructions}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )} */}
        <Prescriptionui selectedPrescription={selectedPrescription} />
      </Modal>
      </>

  );
};

export default PrescriptionManagement;
