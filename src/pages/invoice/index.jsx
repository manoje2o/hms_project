import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Typography,
  Divider,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import spaLogo1 from "../../assets/spaLogo1.png";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const initialData = [
  {
    key: "1",
    tabletName: "Paracetamol",
    stock: 50,
    quantity: 2,
    taxable: 100.0,
    gst: 9.0,
    sgst: 9.0,
    total: 118.0,
  },
  {
    key: "2",
    tabletName: "Amoxicillin",
    stock: 30,
    quantity: 1,
    taxable: 200.0,
    gst: 18.0,
    sgst: 18.0,
    total: 236.0,
  },
];

const Invoice = () => {
  const [tableData, setTableData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const totals = useMemo(() => {
    const subTotal = tableData.reduce((acc, item) => acc + item.taxable, 0);
    const discount = subTotal * 0.1;
    const taxableAmount = subTotal - discount;
    const cgst = tableData.reduce((acc, item) => acc + item.gst, 0);
    const sgst = tableData.reduce((acc, item) => acc + item.sgst, 0);
    const total = taxableAmount + cgst + sgst;
    const earlyPayDiscount = 200;
    const earlyPayAmount = total - earlyPayDiscount;

    return {
      subTotal,
      discount,
      taxableAmount,
      cgst,
      sgst,
      total,
      earlyPayDiscount,
      earlyPayAmount,
    };
  }, [tableData]);

  const columns = [
    { title: "Tablet Name", dataIndex: "tabletName", key: "tabletName" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Taxable", dataIndex: "taxable", key: "taxable" },
    { title: "GST", dataIndex: "gst", key: "gst" },
    { title: "SGST", dataIndex: "sgst", key: "sgst" },
    { title: "Total", dataIndex: "total", key: "total" },
  ];

  const handleAddTablet = () => {
    form.validateFields().then((values) => {
      const total =
        Number(values.taxable) + Number(values.gst) + Number(values.sgst);
      const newData = {
        key: Date.now().toString(),
        ...values,
        total,
      };
      setTableData([...tableData, newData]);
      setModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Card style={{ maxWidth: 900, margin: "auto", border: "1px solid #ccc", padding: 20 }}>
      {/* Header */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ color: "#000" }}>Invoice</Title>
          <img src={spaLogo1} alt="Logo" style={{ width: 100 }} />
        </Col>
        <Col>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Invoice">004</Descriptions.Item>
            <Descriptions.Item label="Invoice Date">
              {dayjs().format("MMM DD, YYYY")}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider />

      {/* Billed Info */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Billed by" size="small">
            <Input placeholder="Name" defaultValue="Foobar Labs" style={{ marginBottom: 8 }} />
            <TextArea
              placeholder="Address"
              defaultValue="4B, Raghuvan Tower, Bengaluru"
              autoSize={{ minRows: 3 }}
              style={{ marginBottom: 8 }}
            />
            <Input placeholder="GSTIN" defaultValue="29ABCDE1234F2Z5" style={{ marginBottom: 8 }} />
            <Input placeholder="PAN" defaultValue="ABCDE1234F" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Billed to" size="small">
            <Input placeholder="Name" style={{ marginBottom: 8 }} />
            <TextArea placeholder="Address" autoSize={{ minRows: 3 }} style={{ marginBottom: 8 }} />
            <Input placeholder="GSTIN" style={{ marginBottom: 8 }} />
            <Input placeholder="PAN" />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Add Tablet Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: "#0D5C63", borderColor: "#0D5C63" }}
          onClick={() => setModalVisible(true)}
        >
          Add Tablet
        </Button>
      </div>

      {/* Table */}
      <Table dataSource={tableData} columns={columns} pagination={false} bordered />

      <Divider />
      <Row gutter={16}>
  {/* Payment Details Card */}
  <Col xs={24} md={14}>
    <Card
      title="Bank / Payment Details"
      bordered={false}
      style={{
        marginTop: 24,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12} lg={12}>
            <Form.Item
              label="Payment Type"
              name="paymentType"
              rules={[{ required: true, message: "Please select payment type" }]}
            >
              <Select placeholder="Select payment type">
                <Option value="cash">Cash</Option>
                <Option value="card">Card</Option>
                <Option value="upi">UPI</Option>
                <Option value="netbanking">Net Banking</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={12}>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={12}>
            <Form.Item
              label="Date"
              name="paymentDate"
              rules={[{ required: true, message: "Please select payment date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={12}>
            <Form.Item
              label="Time"
              name="paymentTime"
              rules={[{ required: true, message: "Please select payment time" }]}
            >
              <DatePicker.TimePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                <Option value="paid">Paid</Option>
                <Option value="pending">Pending</Option>
                <Option value="failed">Failed</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  </Col>

  {/* Totals Card */}
  <Col xs={24} md={10}>
    <Card
      title="Payment Summary"
      style={{
        marginTop: 24,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
      }}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Sub Total">₹{totals.subTotal.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="Discount (10%)">- ₹{totals.discount.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="Taxable Amount">₹{totals.taxableAmount.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="CGST">₹{totals.cgst.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="SGST">₹{totals.sgst.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="Total">
          <Text strong>₹{totals.total.toFixed(2)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="EarlyPay Discount">- ₹{totals.earlyPayDiscount.toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="EarlyPay Amount">
          <Text strong style={{ color: "#0db14b" }}>
            ₹{totals.earlyPayAmount.toFixed(2)}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </Col>
</Row>

      

      <Divider />

      

      {/* Footer */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Bank & Payment Details" size="small">
            <Text>Foobar Labs</Text><br />
            Account No: 453624087967<br />
            IFSC: SBIN0017959<br />
            Account Type: Savings<br />
            Bank: State Bank of India<br />
            UPI: foobarlabs@sbi
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Terms and Conditions" size="small">
            1. 18% interest will be charged on delayed payments.<br />
            2. Invoice number required when remitting funds.
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Additional Notes" size="small">
            This is a computer-generated invoice.<br />
            For any queries, email sandeep888626@gmail.com<br />
            or call us at +91 9108660482
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal
        title="Add Tablet"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddTablet}
        okText="Add"
        cancelText="Cancel"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="tabletName" label="Tablet Name" rules={[{ required: true, message: "Please select tablet name" }]}>
            <Select
              showSearch
              placeholder="Select a tablet"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="Paracetamol">Paracetamol</Option>
              <Option value="Amoxicillin">Amoxicillin</Option>
              <Option value="Ibuprofen">Ibuprofen</Option>
              <Option value="Cetirizine">Cetirizine</Option>
              <Option value="Azithromycin">Azithromycin</Option>
            </Select>
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="taxable" label="Taxable" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="gst" label="GST" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="sgst" label="SGST" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
    
  );
};

export default Invoice;
