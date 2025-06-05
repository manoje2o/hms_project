import React, { useState } from 'react';
import RoleBasedDashboard from '../../components/Dashboard';
import { Select } from 'antd';

const { Option } = Select;

const IndexPage = () => {
  const [role, setRole] = useState('front-desk');

  const handleChange = (value) => {
    setRole(value);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Select Role:</h2>
        <Select
          value={role}
          onChange={handleChange}
          style={{ width: 200 }}
        >
          <Option value="admin">Admin</Option>
          <Option value="doctor">Doctor</Option>
          <Option value="pharmacist">Pharmacist</Option>
          <Option value="front-desk">Front Desk</Option>
        </Select>
      </div>

      <RoleBasedDashboard role={role} />
    </div>
  );
};

export default IndexPage;
