import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Table,
  DatePicker,
  Switch,
  Popconfirm,
  message,
} from "antd";
import Main from "../../layout/Main";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import Button from "../../components/button/Button";
import { showSuccessToast } from "../../utils/toastutils";

const { Option } = Select;

const ROLES = {
  1: "Doctor",
  2: "Nurse",
  3: "Staff",
};

const DESIGNATIONS = {
  1: "Senior",
  2: "Junior",
  3: "Intern",
};

const Index = () => {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rolefilterButton, setRoleFilterButton] = useState(false);

  const handleAddOrUpdate = (values) => {
    const memberData = {
      ...values,
      DOB: values.DOB?.format("YYYY-MM-DD"),
      JoinDate: values.JoinDate?.format("YYYY-MM-DD"),
    };

    if (editingKey !== null) {
      const updated = [...members];
      updated[editingKey] = memberData;
      setMembers(updated);
      showSuccessToast("Member updated successfully!");
    } else {
      setMembers([...members, memberData]);
      showSuccessToast("Member added successfully!");
    }

    form.resetFields();
    setEditingKey(null);
    setModalOpen(false);
  };

  const handleEdit = (record, index) => {
    form.setFieldsValue({
      ...record,
      DOB: dayjs(record.DOB),
      JoinDate: dayjs(record.JoinDate),
    });
    setEditingKey(index);
    setModalOpen(true);
  };

  const handleDelete = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
    message.success("Member deleted successfully!");
  };

  const columns = [
    { title: "Full Name", dataIndex: "FullName" },
    { title: "Gender", dataIndex: "Gender" },
    { title: "Mobile", dataIndex: "Mobile" },
    { title: "Email", dataIndex: "Email" },
    { title: "Username", dataIndex: "Username" },
    {
      title: "Role",
      dataIndex: "RoleId",
      render: (val) => ROLES[val] || "-",
    },
    {
      title: "Designation",
      dataIndex: "DesignationId",
      render: (val) => DESIGNATIONS[val] || "-",
    },
    {
      title: "Active",
      dataIndex: "IsActive",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Actions",
      render: (_, record, index) => (
        <div className="d-flex gap-2">
          <button
            text="Edit"
            className="btn btn-sm btn-outline-success"
            onClick={() => handleEdit(record, index)}
          >Edit</button>
          <Popconfirm
            title="Confirm delete?"
            onConfirm={() => handleDelete(index)}
          >
            <button
              text="Delete"
              className="btn btn-sm btn-outline-danger"
              danger
            >Delete</button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesRole = roleFilter ? member.RoleId === roleFilter : true;
    const search = searchQuery.toLowerCase();
    const matchesSearch = search
      ? member.FullName?.toLowerCase().includes(search) ||
        member.Username?.toLowerCase().includes(search) ||
        member.Email?.toLowerCase().includes(search)
      : true;
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <Main
        tittle="Member Management"
        addButtonTittle="Add Member"
        columns={columns}
        datasource={filteredMembers}
        onClick={() => {
          form.resetFields();
          setEditingKey(null);
          setModalOpen(true);
        }}
        filter={
          <div className="position-relative shadow-md d-flex justify-content-end align-items-center mx-3 mt-4 mb-2">
            <Button
              text={<FiFilter />}
              size={22}
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() => setRoleFilterButton((prev) => !prev)}
            />
            <AnimatePresence>
              {rolefilterButton && (
                <motion.div
                  className="position-absolute bg-white shadow p-3 rounded"
                  style={{ right: 0, top: 40, zIndex: 100 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="d-flex flex-column gap-3" style={{ minWidth: 300 }}>
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      placeholder="Select Role"
                      onChange={(value) => setRoleFilter(value)}
                    >
                      <Option value={1}>Doctor</Option>
                      <Option value={2}>Nurse</Option>
                      <Option value={3}>Staff</Option>
                    </Select>
                    <Input
                      placeholder="Search by name, email or username"
                      onChange={(e) =>
                        setSearchQuery(e.target.value.toLowerCase())
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />

      <Modal
        open={modalOpen}
        title={editingKey !== null ? "Edit Member" : "Add Member"}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingKey(null);
        }}
        footer={null}
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleAddOrUpdate}>
          <Form.Item name="FullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="Gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="DOB" label="Date of Birth" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="Mobile" label="Mobile" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="Email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="Username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="RoleId" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value={1}>Doctor</Option>
              <Option value={2}>Nurse</Option>
              <Option value={3}>Staff</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="DesignationId"
            label="Designation"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select designation">
              <Option value={1}>Senior</Option>
              <Option value={2}>Junior</Option>
              <Option value={3}>Intern</Option>
            </Select>
          </Form.Item>

          <Form.Item name="JoinDate" label="Join Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="IsActive" label="Is Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item className="text-end">
            <Button
              onClick={() => {
                form.resetFields();
                setModalOpen(false);
                setEditingKey(null);
              }}
              className="me-2"
              text="Cancel"
            />
            <Button
              type="primary"
              htmlType="submit"
              text={editingKey !== null ? "Update" : "Add"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Index;
