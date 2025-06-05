import React from 'react';
import {
  Card,
  Col,
  Row,
  Table,
  Badge,
  List,
  Progress,
} from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const statsData = [
  { title: 'Total Patients', value: 1200 },
  { title: 'Daily Visits', value: 85 },
  { title: 'Avg. Treatment Time', value: '45 min' },
  { title: 'Admitted Patients', value: 320 },
];

const chartData = [
  { month: 'Jan', income: 10000, expenses: 4000 },
  { month: 'Feb', income: 12000, expenses: 5000 },
  { month: 'Mar', income: 14000, expenses: 4500 },
  { month: 'Apr', income: 15000, expenses: 6000 },
  { month: 'May', income: 17000, expenses: 6500 },
];

const patientChartData = [
  { name: 'Mon', visits: 20 },
  { name: 'Tue', visits: 30 },
  { name: 'Wed', visits: 45 },
  { name: 'Thu', visits: 38 },
  { name: 'Fri', visits: 50 },
  { name: 'Sat', visits: 60 },
];

const demographicsData = [
  { name: 'Male', value: 700 },
  { name: 'Female', value: 500 },
];
const COLORS = ['#0088FE', '#FF69B4'];

const RoleBasedDashboard = ({ role }) => {
  const renderAdminDashboard = () => (
    <>
      <Row gutter={16}>
        {statsData.map((item, idx) => (
          <Col span={6} key={idx}>
            <Card title={item.title}>{item.value}</Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} className="mt-4">
        <Col span={12}>
          <Card title="Revenue Overview">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#4caf50" name="Income" />
                <Bar dataKey="expenses" fill="#f44336" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Patient Demographics">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt-4">
        <Col span={24}>
          <Card title="Alerts & Notices">
            <ul>
              <li>🚨 Emergency case in ICU</li>
              <li>⚠️ Bed shortage in Ward B</li>
              <li>🧯 Fire drill scheduled tomorrow</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderDoctorDashboard = () => (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Upcoming Appointments">
            <Table
              size="small"
              pagination={false}
              columns={[
                { title: 'Patient', dataIndex: 'name' },
                { title: 'Time', dataIndex: 'time' },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  render: (status) => (
                    <Badge color={status === 'Confirmed' ? 'green' : 'orange'} text={status} />
                  ),
                },
              ]}
              dataSource={[
                { name: 'Alice Ray', time: '10:00 AM', status: 'Confirmed' },
                { name: 'Ben Stokes', time: '11:00 AM', status: 'Pending' },
                { name: 'Clara Oswald', time: '01:00 PM', status: 'Confirmed' },
              ]}
              rowKey="name"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Reminders">
            <ul>
              <li>Follow-up with Sarah Lewis</li>
              <li>Update prescription for John Doe</li>
              <li>Send lab request for Jake Smith</li>
            </ul>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mt-4">
        <Col span={24}>
          <Card title="Patient Queue Progress">
            <Progress percent={70} status="active" />
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderPharmacyDashboard = () => (
    <>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Sales Overview">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#1890ff" name="Sales" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Top-Selling Medicines">
            <List
              dataSource={[
                'Paracetamol',
                'Amoxicillin',
                'Ibuprofen',
                'Cetirizine',
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderFrontDeskDashboard = () => (
    <>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Daily Patient Visits">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#673ab7" name="Visits" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Today's Check-ins">
            <Table
              size="small"
              pagination={false}
              columns={[
                { title: 'Name', dataIndex: 'name' },
                { title: 'Check-in Time', dataIndex: 'time' },
              ]}
              dataSource={[
                { name: 'Priya K.', time: '09:15 AM' },
                { name: 'Ramesh V.', time: '09:45 AM' },
                { name: 'Latha D.', time: '10:10 AM' },
              ]}
              rowKey="name"
            />
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return renderAdminDashboard();
      case 'doctor':
        return renderDoctorDashboard();
      case 'pharmacist':
        return renderPharmacyDashboard();
      case 'front-desk':
        return renderFrontDeskDashboard();
      default:
        return <p>Unauthorized Role</p>;
    }
  };

  return <div className="p-4 overflow-auto h-[calc(100vh-100px)]">{renderDashboard()}</div>;
};

export default RoleBasedDashboard;
