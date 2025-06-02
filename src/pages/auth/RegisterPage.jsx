import React from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log('Registering with values:', values);
      const data = await register(values);

      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      message.success('Реєстрація успішна');
      navigate('/lectures');
    } catch (error) {
      console.error(error);
      message.error(error || 'Помилка реєстрації');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Card>
        <Title level={3}>Реєстрація</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Ім’я"
            name="firstName"
            rules={[{ required: true, message: 'Введіть ім’я' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Прізвище"
            name="lastName"
            rules={[{ required: true, message: 'Введіть прізвище' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введіть email' },
              { type: 'email', message: 'Некоректний email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введіть пароль' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Зареєструватися
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="link" block onClick={() => navigate('/login')}>
              Вже є акаунт? Увійти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
