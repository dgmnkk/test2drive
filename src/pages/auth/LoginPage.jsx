import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await login(values.email, values.password);
            sessionStorage.setItem('accessToken', res.accessToken);
            sessionStorage.setItem('refreshToken', res.refreshToken);
            sessionStorage.setItem('user', JSON.stringify(res.user));
            sessionStorage.setItem('email', res.user.email);
            message.success('Успішний вхід');
            navigate('/lectures');
        } catch (err) {
            message.error(err.message || 'Помилка входу');
        }
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ color: '#001529', marginBottom: '70px' }}>Вхід</h1>
            <Form
                name="login"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ type: 'email', required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" style={{ background: '#001529' }} htmlType="submit">
                        Увійти
                    </Button>
                </Form.Item>

                <p>Немає акаунту? <Link to="/register">Зареєструватись зараз</Link></p>
            </Form>
        </div>
    );
};

export default LoginPage