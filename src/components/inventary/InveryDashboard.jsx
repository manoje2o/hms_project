import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Statistic,
  message,
  DatePicker,
} from "antd";
// import { Line } from "@ant-design/charts";
import dayjs from "dayjs";
import { Pie } from "@ant-design/charts";

const InventoryDashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSubtractModalVisible, setIsSubtractModalVisible] = useState(false);
  const [isAddInventoryModalVisible, setIsAddInventoryModalVisible] = useState(false);
  const [stockForm] = Form.useForm();
  const [subtractForm] = Form.useForm();
  const [addInventoryForm] = Form.useForm();
  const [stockHistory, setStockHistory] = useState([]);
  const [dispatchHistory, setDispatchHistory] = useState([]);
  const [filter, setFilter] = useState("total");
  const [submitLoading, setSubmitLoading] = useState(false);


  const dummyInventory = [
    {
      ItemId: 1,
      ItemName: "Paracetamol",
      Category: "Medicine",
      Unit: "Box",
      Quantity: 25,
      PurchasePrice: 20,
      SellingPrice: 30,
      ExpiryDate: dayjs().add(3, "months").toISOString(),
    },
    {
      ItemId: 2,
      ItemName: "Amoxicillin",
      Category: "Antibiotic",
      Unit: "Bottle",
      Quantity: 8,
      PurchasePrice: 45,
      SellingPrice: 60,
      ExpiryDate: dayjs().subtract(5, "days").toISOString(),
    },
    {
      ItemId: 3,
      ItemName: "Bandage",
      Category: "Medical Supply",
      Unit: "Pack",
      Quantity: 5,
      PurchasePrice: 10,
      SellingPrice: 15,
      ExpiryDate: dayjs().add(6, "months").toISOString(),
    },
    {
      ItemId: 4,
      ItemName: "Cough Syrup",
      Category: "Syrup",
      Unit: "Bottle",
      Quantity: 15,
      PurchasePrice: 25,
      SellingPrice: 40,
      ExpiryDate: dayjs().subtract(2, "months").toISOString(),
    },
    {
      ItemId: 5,
      ItemName: "Glucose Powder",
      Category: "Supplement",
      Unit: "Can",
      Quantity: 12,
      PurchasePrice: 35,
      SellingPrice: 50,
      ExpiryDate: dayjs().add(1, "month").toISOString(),
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setInventoryData(dummyInventory);
      setFilteredData(dummyInventory);
      setLoading(false);
    }, 500);
  }, []);

  const expired = inventoryData.filter((item) =>
    dayjs(item.ExpiryDate).isBefore(dayjs())
  );
  const low = inventoryData.filter((item) => item.Quantity <= 10);

  const totalStock = inventoryData.length;
  const expiredStock = expired.length;
  const lowStock = low.length;

  const totalInventoryValue = inventoryData.reduce(
    (acc, item) => acc + item.Quantity * item.PurchasePrice,
    0
  );

  const averagePurchasePrice = (
    inventoryData.reduce((acc, item) => acc + item.PurchasePrice, 0) / totalStock
  ).toFixed(2);

  const averageSellingPrice = (
    inventoryData.reduce((acc, item) => acc + item.SellingPrice, 0) / totalStock
  ).toFixed(2);

  const filterData = (type) => {
    setFilter(type);
    if (type === "total") setFilteredData(inventoryData);
    else if (type === "expired") setFilteredData(expired);
    else if (type === "low") setFilteredData(low);
  };

  const handleAddStock = async () => {
    try {
      const values = await stockForm.validateFields();
      setSubmitLoading(true);
      const newInventory = inventoryData.map((item) =>
        item.ItemId === values.itemId
          ? { ...item, Quantity: item.Quantity + values.quantity }
          : item
      );
      setInventoryData(newInventory);
      filterData(filter);
      setStockHistory((prev) => [
        ...prev,
        {
          itemId: values.itemId,
          quantityAdded: values.quantity,
          date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
      stockForm.resetFields();
      setIsAddModalVisible(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDispatchStock = async () => {
    try {
      const values = await subtractForm.validateFields();
      const item = inventoryData.find((i) => i.ItemId === values.itemId);
      if (!item || item.Quantity < values.quantity) {
        return message.error("Not enough stock to dispatch!");
      }
      setSubmitLoading(true);
      const newInventory = inventoryData.map((item) =>
        item.ItemId === values.itemId
          ? { ...item, Quantity: item.Quantity - values.quantity }
          : item
      );
      setInventoryData(newInventory);
      filterData(filter);
      setDispatchHistory((prev) => [
        ...prev,
        {
          itemId: values.itemId,
          quantityDispatched: values.quantity,
          date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
      subtractForm.resetFields();
      setIsSubtractModalVisible(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddInventory = async () => {
    try {
      const values = await addInventoryForm.validateFields();
      setSubmitLoading(true);
      const newItem = {
        ...values,
        ItemId: inventoryData.length
          ? Math.max(...inventoryData.map((item) => item.ItemId)) + 1
          : 1,
        ExpiryDate: values.ExpiryDate.toISOString(),
      };
      const updatedInventory = [...inventoryData, newItem];
      setInventoryData(updatedInventory);
      filterData(filter);
      addInventoryForm.resetFields();
      setIsAddInventoryModalVisible(false);
      message.success("New inventory item added!");
    } catch (error) {
      console.error("Add Inventory Error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const unifiedStockHistory = [
    ...stockHistory.map((entry) => ({
      type: "Added",
      itemId: entry.itemId,
      quantity: entry.quantityAdded,
      date: entry.date,
    })),
    ...dispatchHistory.map((entry) => ({
      type: "Dispatched",
      itemId: entry.itemId,
      quantity: entry.quantityDispatched,
      date: entry.date,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const stockChartData = [
    ...stockHistory.map((entry) => ({
      date: dayjs(entry.date).format("YYYY-MM-DD"),
      type: "Added",
      quantity: entry.quantityAdded,
    })),
    ...dispatchHistory.map((entry) => ({
      date: dayjs(entry.date).format("YYYY-MM-DD"),
      type: "Dispatched",
      quantity: entry.quantityDispatched,
    })),
  ];

  const chartConfig = {
    data: stockChartData,
    xField: "date",
    yField: "quantity",
    seriesField: "type",
    smooth: true,
    color: {
      Added: "#52c41a",
      Dispatched: "#fa541c",
    },
    tooltip: {
      showMarkers: true,
    },
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    lineStyle: {
      lineWidth: 3,
    },
    legend: {
      position: "top",
    },
  };
 const pieChartData = [
  {
    type: "Expired",
    value: expiredStock,
  },
  {
    type: "Low Stock",
    value: lowStock,
  },
  {
    type: "Available",
    value: totalStock - expiredStock - lowStock,
  },
];

// Pie chart config
const pieConfig = {
  appendPadding: 10,
  data: pieChartData,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.5,
  label: {
    type: 'spider',
    labelHeight: 28,
    content: '{name}\n{percentage}',
  },
  interactions: [
    {
      type: 'element-active',
    },
  ],
  color: ['#f5222d', '#fa8c16', '#52c41a'], // red, orange, green
};

  return (
    <div className="overflow-y-hidden p-2">
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Total Stock Items" value={totalStock} /></Card></Col>
        <Col span={6}><Card><Statistic title="Expired Items" value={expiredStock} /></Card></Col>
        <Col span={6}><Card><Statistic title="Low Stock Items" value={lowStock} /></Card></Col>
        <Col span={6}><Card><Statistic title="Total Inventory Value" value={`₹${totalInventoryValue}`} /></Card></Col>
      </Row>

      <Row style={{ marginTop: 16, marginBottom: 16 }} justify="end" gutter={16}>
        <Col span={8}>
          <div className="d-flex justify-content-end my-2">
            <Button.Group>
              <Button size="large" type={filter === "total" ? "primary" : "default"} onClick={() => filterData("total")}>All</Button>
              <Button size="large" type={filter === "expired" ? "primary" : "default"} onClick={() => filterData("expired")}>Expired</Button>
              <Button size="large" type={filter === "low" ? "primary" : "default"} onClick={() => filterData("low")}>Low Stock</Button>
            </Button.Group>
          </div>
        </Col>
        <Col span={24}>
          <Card title="📦 Inventory List">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => setIsAddInventoryModalVisible(true)}>Add Inventory</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setIsSubtractModalVisible(true)}>Dispatch Stock</Button>
            </div>
            <Table
              dataSource={filteredData}
              rowKey="ItemId"
              loading={loading}
              rowClassName={(record) => {
                if (dayjs(record.ExpiryDate).isBefore(dayjs())) return "expired-row";
                if (record.Quantity <= 10) return "low-stock-row";
                return "";
              }}
              columns={[
                { title: "Item", dataIndex: "ItemName" },
                { title: "Category", dataIndex: "Category" },
                { title: "Unit", dataIndex: "Unit" },
                { title: "Qty", dataIndex: "Quantity" },
                { title: "Purchase ₹", dataIndex: "PurchasePrice" },
                { title: "Selling ₹", dataIndex: "SellingPrice" },
                {
                  title: "Expiry",
                  dataIndex: "ExpiryDate",
                  render: (val) => dayjs(val).format("YYYY-MM-DD"),
                  sorter: (a, b) => new Date(a.ExpiryDate) - new Date(b.ExpiryDate),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="📊 Stock History (Added / Dispatched)">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => setIsAddModalVisible(true)}>Add Stock</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setIsSubtractModalVisible(true)}>Dispatch Stock</Button>
            </div>
            <Table
              dataSource={unifiedStockHistory}
              rowKey={(record, index) => index}
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: "Item Name",
                  dataIndex: "itemId",
                  render: (id) =>
                    inventoryData.find((item) => item.ItemId === id)?.ItemName || "Deleted Item",
                },
                {
                  title: "Type",
                  dataIndex: "type",
                  render: (text) => <Tag color={text === "Added" ? "green" : "volcano"}>{text}</Tag>,
                },
                { title: "Quantity", dataIndex: "quantity" },
                { title: "Date", dataIndex: "date" },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
  <Col span={12}>
    <Card title="🧮 Inventory Breakdown">
      <Pie {...pieConfig} />
    </Card>
  </Col>
</Row>

      {/* Modals (Add/Dispatch/Inventory) — same as before */}
      {/* Add Stock Modal */}
      <Modal title="Add Stock" open={isAddModalVisible} onCancel={() => setIsAddModalVisible(false)} onOk={handleAddStock} confirmLoading={submitLoading}>
        <Form form={stockForm} layout="vertical">
          <Form.Item name="itemId" label="Select Item" rules={[{ required: true }]}>
            <Select placeholder="Select an item">
              {inventoryData.map((item) => (
                <Select.Option key={item.ItemId} value={item.ItemId}>{item.ItemName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Dispatch Stock Modal */}
      <Modal title="Dispatch Stock" open={isSubtractModalVisible} onCancel={() => setIsSubtractModalVisible(false)} onOk={handleDispatchStock} confirmLoading={submitLoading}>
        <Form form={subtractForm} layout="vertical">
          <Form.Item name="itemId" label="Select Item" rules={[{ required: true }]}>
            <Select placeholder="Select an item">
              {inventoryData.map((item) => (
                <Select.Option key={item.ItemId} value={item.ItemId}>{item.ItemName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Inventory Modal */}
      <Modal title="Add New Inventory Item" open={isAddInventoryModalVisible} onCancel={() => setIsAddInventoryModalVisible(false)} onOk={handleAddInventory} confirmLoading={submitLoading}>
        <Form form={addInventoryForm} layout="vertical">
          <Form.Item name="ItemName" label="Item Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Unit" label="Unit" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="PurchasePrice" label="Purchase Price ₹" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="SellingPrice" label="Selling Price ₹" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="ExpiryDate" label="Expiry Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryDashboard;
