import {
  Table,
  Form,
  Input,
  Modal,
  Checkbox,
  Popconfirm,
  message,
  Button,
} from "antd";
import React, { useState, useEffect } from "react";
import axios from "../../Axios";
import CustomButton from "../../components/button/Button";
import { showSuccessToast } from "../../utils/toastutils";

const screenAccessData = [
  "Dashboard",
  "Patient",
  "Prescription",
  "Inventory",
  "Member",
  "Pharmacy",
  "Expenses",
  "Report",
  "Appointments",
  "OP/IP",
  "Setting",
];

const Index = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/Role/GetAllRoles");
      const rawData = Array.isArray(res.data) ? res.data : res.data.data;

      if (!Array.isArray(rawData)) {
        console.error("Expected an array of roles but got:", rawData);
        return;
      }

      const formatted = rawData.map((role) => ({
        key: role.roleId,
        roleId: role.roleId,
        roleName: role.roleName,
        description: role.description,
        screenAccess: role.screenAccess || [],
      }));

      setRoles(formatted);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const showModal = (role = null) => {
    if (role) {
      form.setFieldsValue({
        roleName: role.roleName,
        description: role.description,
        permissions: role.screenAccess?.reduce((acc, screen) => {
          acc[screen.screenName] = {
            canRead: screen.canRead,
            canWrite: screen.canWrite,
          };
          return acc;
        }, {}),
      });
      setSelectedScreens(role.screenAccess?.map((s) => s.screenName) || []);
      setEditingRole(role);
    } else {
      form.resetFields();
      setSelectedScreens([]);
      setEditingRole(null);
    }

    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedScreens([]);
    setEditingRole(null);
    setIsModalOpen(false);
  };

  const handleScreenToggle = (checked, screen) => {
    if (checked) {
      setSelectedScreens([...selectedScreens, screen]);
    } else {
      setSelectedScreens(selectedScreens.filter((s) => s !== screen));
    }
  };

  const handleSubmit = async (values) => {
    const permissions = {};
    selectedScreens.forEach((screen) => {
      permissions[screen] = {
        canRead: values?.permissions?.[screen]?.canRead || false,
        canWrite: values?.permissions?.[screen]?.canWrite || false,
      };
    });

    const payload = {
      roleName: values.roleName,
      description: values.description,
      screenAccess: Object.entries(permissions).map(
        ([screenName, perms], idx) => ({
          screenId: idx + 1,
          screenName,
          ...perms,
        })
      ),
    };

    try {
      if (editingRole) {
        await axios.put(`/Role/UpdateRole/${editingRole.roleId}`, payload);
        showSuccessToast("Role updated successfully");
        message.success("Role updated successfully");
      } else {
        await axios.post("/Role/CreateRoleScreen", payload);
        showSuccessToast("Role created successfully");
        message.success("Role created successfully");
      }

      handleCancel();
      fetchRoles();
    } catch (err) {
      console.error("Error saving role:", err);
      message.error("Failed to save role");
    }
  };

  const handleDelete = async (roleId) => {
    console.log("Deleting role with ID:", roleId);
    
    try {
      await axios.delete(`/Role/DeleteRole/${roleId}`);
      showSuccessToast("Role deleted successfully");
      message.success({ content: "Role deleted successfully", key: "delete" });
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      message.error({ content: "Failed to delete role", key: "delete" });
    }
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button type="default" onClick={() => showModal(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => handleDelete(record.roleId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ marginLeft: 8 }}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white mx-3 my-4 px-3 px-md-4 py-4 py-md-4 rounded-4 shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0 text-dark fw-serif fw-bold">Role Management</h1>
        <CustomButton
          text="Add a Role"
          type="primary"
          style={{ marginBottom: "20px" }}
          onClick={() => showModal()}
        />
      </div>

      <Table columns={columns} dataSource={roles} />

      <Modal
        title={editingRole ? "Edit Role" : "Add a Role"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        bodyStyle={{
          maxHeight: "60vh",
          overflowY: "auto",
          paddingRight: "16px",
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Role Name"
            name="roleName"
            rules={[{ required: true, message: "Please enter a role name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <Form.Item label="Screen Permissions">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-3">
              {screenAccessData.map((screen) => (
                <div key={screen} className="col">
                  <div className="border p-3 rounded-lg flex justify-between items-start hover:shadow-md transition-all duration-200">
                    <Checkbox
                      checked={selectedScreens.includes(screen)}
                      onChange={(e) =>
                        handleScreenToggle(e.target.checked, screen)
                      }
                      style={{ fontWeight: 600 }}
                    >
                      {screen}
                    </Checkbox>

                    {selectedScreens.includes(screen) && (
                      <div className="flex gap-4 mt-1">
                        <Form.Item
                          name={["permissions", screen, "canRead"]}
                          valuePropName="checked"
                          noStyle
                        >
                          <Checkbox>Read</Checkbox>
                        </Form.Item>
                        <Form.Item
                          name={["permissions", screen, "canWrite"]}
                          valuePropName="checked"
                          noStyle
                        >
                          <Checkbox>Write</Checkbox>
                        </Form.Item>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Index;
