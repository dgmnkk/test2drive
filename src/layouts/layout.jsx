import React from 'react'
import { Link, Outlet, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
    FileDoneOutlined,
  UserOutlined,
  CarOutlined,
  LogoutOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme} from 'antd';
import { useState } from 'react';
const { Header, Sider, Content } = Layout;


const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const user = sessionStorage.getItem('user');
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/'); 
  };

  return (
    user ? (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ paddingTop: '50px' }} trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
        >
          <Menu.Item key="1" icon={<BookOutlined />}>
            <Link to="/lectures">Лекції</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileDoneOutlined />}>
            <Link to="/tests">Тести</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CarOutlined />}>
            <Link to="/exam">Екзамен</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            <Link to="/profile">Мій профіль</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />}>
            <p onClick={handleLogout}>
                Вихід
            </p>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
    ) : (
      <Navigate to="/login" replace />
    )
  );
}

export default MainLayout