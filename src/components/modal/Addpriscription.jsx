import React,{useState} from "react";
import Button from "../button/Button";
import {
  Form,
  Input,
  DatePicker,
  Space,
  Divider,
  message,
  Modal
} from "antd";
import dayjs from "dayjs";
import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";


const Addpriscription = () => {
      const [isOpen, setIsopen] = useState(false);
      const [editingPatient, setEditingPatient] = useState(null);
        const [modalOpen, setModalOpen] = useState(false);
        const [editingKey, setEditingKey] = useState(null);
        // const [viewModalOpen, setViewModalOpen] = useState(false);
        // const [selectedPrescription, setSelectedPrescription] = useState(null);
        const [form] = Form.useForm();
      
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
  return (
    <div>
      <Button
        text="add prescription"
        type="primary"
        className="w-full mt-4"
        onClick={() => setModalOpen(true)}
      />
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
    </div>
  );
};

export default Addpriscription;
