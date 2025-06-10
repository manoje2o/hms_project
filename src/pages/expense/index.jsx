import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, message, Modal, Table, Popconfirm, Descriptions } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

const Expense = () => {
  const [form] = Form.useForm();
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingExpense, setViewingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('https://localhost:7014/api/Expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingExpense(null);
  };

  const handleSubmit = async (values) => {
    const expenseData = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };

    try {
      if (editingExpense) {
        await axios.put(`https://localhost:7014/api/Expenses/${editingExpense.expenseId}`, {
          ...editingExpense,
          ...expenseData
        });
        message.success('Expense updated successfully!');
      } else {
        await axios.post('https://localhost:7014/api/Expenses', expenseData);
        message.success('Expense added successfully!');
      }
      fetchExpenses();
      setIsModalVisible(false);
      form.resetFields();
      setEditingExpense(null);
    } catch (error) {
      message.error('Failed to save expense');
    }
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`https://localhost:7014/api/Expenses/${record.expenseId}`);
      message.success('Expense deleted successfully!');
      fetchExpenses();
    } catch (error) {
      message.error('Failed to delete expense');
    }
  };

  const handleEdit = (record) => {
    setEditingExpense(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    });
    setIsModalVisible(true);
  };

  const handleView = (record) => {
    setViewingExpense(record);
    setViewModalVisible(true);
  };

  const columns = [
    { title: 'Expense Type', dataIndex: 'expenseType', key: 'expensetype' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Paid To', dataIndex: 'paidTo', key: 'paidTo' },
    { title: 'Description', dataIndex: 'description', key: 'Description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleView(record)}>View</Button>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white mx-3 my-4 px-3 px-md-4 py-4 py-md-5 rounded-4 shadow-sm border">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 border-bottom pb-3 gap-3">
        <h2 className="mb-0 text-dark fw-serif fw-bold">👩‍⚕️ Expenses Management</h2>
        <Button type="primary" onClick={showModal} style={{ backgroundColor: "#0D5C63", borderColor: "#0D5C63" }}
>Add Expense</Button>
      </div>

      <Table dataSource={expenses} columns={columns} rowKey="expenseId" pagination={{ pageSize: 5 }} />

      <Modal
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Expense Type" name="expenseType" rules={[{ required: true }]}> 
            <Select placeholder="Expense Type">
              <Option value="salary">Salary</Option>
              <Option value="rent">Rent</Option>
              <Option value="electricity_exp">Electricity Expense</Option>
              <Option value="employee_exp">Employee Expense</Option>
              <Option value="travel_entertainment">Travel & Entertainment</Option>
              <Option value="other_exp">Other Expense</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}> 
            <Input type="number" prefix="₹" placeholder="e.g., 450.00" />
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Paid To" name="paidTo">
            <Input placeholder="e.g., Amazon, Landlord" />
          </Form.Item>

          <Form.Item label="Notes" name="Description">
            <Input.TextArea rows={3} placeholder="Optional details" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingExpense ? 'Update Expense' : 'Submit Expense'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Expense Details"
        open={viewModalVisible}
        footer={<Button onClick={() => setViewModalVisible(false)}>Close</Button>}
        onCancel={() => setViewModalVisible(false)}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Expense Type">{viewingExpense?.expensetype}</Descriptions.Item>
          <Descriptions.Item label="Amount">₹ {viewingExpense?.amount}</Descriptions.Item>
          <Descriptions.Item label="Date">{viewingExpense?.date}</Descriptions.Item>
          <Descriptions.Item label="Paid To">{viewingExpense?.paidTo || '-'}</Descriptions.Item>
          <Descriptions.Item label="Notes">{viewingExpense?.notes || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default Expense;
