import React from 'react';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  return (
    <Content style={{ padding: '50px' }}>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        <Title>Welcome to Cyber-LynX</Title>
        <p>This is the home page.</p>
      </div>
    </Content>
  );
};

export default Home;
