import React, { useState } from 'react';
import { Card, Typography, Input, Button, Form, message, Checkbox } from 'antd';

const { Title } = Typography;

const ProfilePage = () => {
  const initialProfile = {
    firstName: 'Імʼя',
    lastName: 'Прізвище',
    email: 'email@example.com',
    city: 'Місто',
    phone: '+380123456789',
    drivingSchool: '',      
    hasDriverLicense: false, 
  };

  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  const onFinish = (values) => {
    setProfile(values);
    setEditing(false);
    message.success('Профіль оновлено!');
  };

  return (
    <Card style={{ maxWidth: 600, margin: '24px auto', padding: '24px' }}>
      <Title level={2}>Мій профіль</Title>

      {!editing ? (
        <div>
          <p><b>Імʼя:</b> {profile.firstName}</p>
          <p><b>Прізвище:</b> {profile.lastName}</p>
          <p><b>Пошта:</b> {profile.email}</p>
          <p><b>Місто:</b> {profile.city}</p>
          <p><b>Телефон:</b> {profile.phone}</p>
          <p><b>Автошкола:</b> {profile.drivingSchool || 'Не вказано'}</p>
          <p><b>Водійське посвідчення:</b> {profile.hasDriverLicense ? 'Так' : 'Ні'}</p>

          <Button type="primary" onClick={() => setEditing(true)}>
            Редагувати
          </Button>
        </div>
      ) : (
        <Form
          layout="vertical"
          initialValues={profile}
          onFinish={onFinish}
        >
          <Form.Item
            label="Імʼя"
            name="firstName"
            rules={[{ required: true, message: 'Будь ласка, введіть імʼя' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Прізвище"
            name="lastName"
            rules={[{ required: true, message: 'Будь ласка, введіть прізвище' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пошта"
            name="email"
            rules={[
              { required: true, message: 'Будь ласка, введіть пошту' },
              { type: 'email', message: 'Введіть коректну пошту' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Місто"
            name="city"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              { pattern: /^\+?\d{9,15}$/, message: 'Введіть коректний номер телефону' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Автошкола"
            name="drivingSchool"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="hasDriverLicense"
            valuePropName="checked"
          >
            <Checkbox>Водійське посвідчення наявне</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Зберегти
            </Button>
            <Button onClick={() => setEditing(false)}>
              Скасувати
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ProfilePage;
