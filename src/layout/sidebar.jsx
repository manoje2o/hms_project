import React, { useState, useEffect } from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  MailOutlined,

} from '@ant-design/icons';
  import { BsPrescription2 } from "react-icons/bs";

import { Menu, Button } from 'antd';
import { CiSettings } from 'react-icons/ci';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Responsive sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    {
      key: '/dashboard',
      icon: <PieChartOutlined />,
      label: <Link to="/dashboard" style={{ textDecoration: 'none' }} >Dashboard</Link>,
    },
    {
      key: 'sub1',
      icon: <MailOutlined />,
      label: 'Patients and Doctors',
      children: [
        {
          key: '/patients',
          label: <Link to="/patient" style={{ textDecoration: 'none' }}>Patient</Link>,
        },
        {
          key: '/sent',
          label: <Link to="/sent" style={{ textDecoration: 'none' }}>Sent</Link>,
        },
      ],
    },
      {
      key: 'User Management',
      icon: <MailOutlined />,
      label: "User Management",
       children: [
        {
          key: '/',
          label: <Link to="/role" style={{ textDecoration: 'none' }}>Role</Link>,
        },
        {
          key: '/',
          label: <Link to="/newmember" style={{ textDecoration: 'none' }}>Member Management</Link>,
        },
      ],
    },
      {
      key: 'Priscription',
      icon: <BsPrescription2 size={18}  />,
      label: <Link to="/prescription" style={{ textDecoration: 'none' }}>prescription </Link>,
    },
     
    {
      key: '/settings',
      icon: <CiSettings size={20} />,
      label: <Link to="/hospital"style={{ textDecoration: 'none' }}>Settings</Link>,
    },
   
  ];

  return (
    <div
      style={{
        width: collapsed ? 80 : 240,
        height: '100vh',
        transition: 'width 0.3s',
        backgroundColor: '#001529',
      }}
      className="text-white d-flex flex-column"
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
        {!collapsed && <h5 className="text-white mb-0">Admin Panel</h5>}
        <Button
          type="text"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="text-white"
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[location.pathname]}
        items={items}
        className="flex-grow-1"
      />
    </div>
  );
};

export default Sidebar;
