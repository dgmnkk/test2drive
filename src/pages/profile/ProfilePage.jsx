import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Button, Form, message, DatePicker, Avatar } from 'antd';
import { getUserProfile, updateUserProfileDetails } from '../../api/profileApi';
import dayjs from 'dayjs';


const { Title } = Typography;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();

        const mergedProfile = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.profile?.phone || '',
          dateOfBirth: data.profile?.dateOfBirth || '',
          avatarUrl: data.profile?.avatarUrl || '',
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
        };

        setProfile(mergedProfile);

        form.setFieldsValue({
          phone: mergedProfile.phone,
          dateOfBirth: mergedProfile.dateOfBirth ? dayjs(mergedProfile.dateOfBirth) : null,
          avatarUrl: mergedProfile.avatarUrl,
        });
      } catch (error) {
        message.error('Не вдалося завантажити профіль');
      }
    };
    fetchProfile();
  }, [form]);

  const onFinish = async (values) => {
    try {
      const bodyToSend = {
      phone: values.phone ? '+380' + values.phone : '',
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      avatarUrl: values.avatarUrl,
    };

      await updateUserProfileDetails(bodyToSend);

      const updatedData = await getUserProfile();

      setProfile({
        firstName: updatedData.firstName || '',
        lastName: updatedData.lastName || '',
        email: updatedData.email || '',
        phone: updatedData.profile?.phone || '',
        dateOfBirth: updatedData.profile?.dateOfBirth || '',
        avatarUrl: updatedData.profile?.avatarUrl || '',
        createdAt: updatedData.createdAt || null,
        updatedAt: updatedData.updatedAt || null,
      });

      setEditing(false);
      message.success('Профіль оновлено!');
    } catch (error) {
      message.error('Помилка оновлення профілю');
    }
  };

  if (!profile) {
    return <p>Завантаження профілю...</p>;
  }

  const formatDate = (dateString) => {
  if (!dateString) return 'Не вказано';
  return new Date(dateString).toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};


  return (
    <Card style={{ maxWidth: 600, margin: '24px auto', padding: '24px' }}>
      <Title level={2}>Мій профіль</Title>

      <p><b>Імʼя:</b> {profile.firstName}</p>
      <p><b>Прізвище:</b> {profile.lastName}</p>
      <p><b>Пошта:</b> {profile.email}</p>
      <p><b>Дата створення профілю:</b> {formatDate(profile.createdAt)}</p>
      <p><b>Дата останнього редагування:</b> {formatDate(profile.updatedAt)}</p>

      {!editing ? (
        <>
          <p><b>Телефон:</b> {profile.phone || 'Не вказано'}</p>
          <p><b>Дата народження:</b> {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Не вказано'}</p>
          {profile.avatarUrl ? (
            <Avatar src={profile.avatarUrl} size={64} style={{ marginRight: 16 }} />
          ) : (
            <p><b>Аватар:</b> Не вказано</p>
          )}

          <Button type="primary" onClick={() => setEditing(true)} style={{ marginTop: 16 }}>
            Редагувати додаткові дані
          </Button>
        </>
      ) : (
        <Form
  form={form}
  layout="vertical"
  onFinish={onFinish}
  style={{ marginTop: 16 }}
>
  <Form.Item
    label="Телефон"
    name="phone"
    rules={[
      {
        required: true,
        message: 'Введіть номер телефону',
      },
      {
        pattern: /^\d{9}$/,
        message: 'Введіть 9 цифр номера без +380',
      },
    ]}
  >
    <Input
      maxLength={9}
      placeholder="123456789"
      addonBefore="+380"
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      }}
    />
  </Form.Item>

  <Form.Item label="Дата народження" name="dateOfBirth">
    <DatePicker format="YYYY-MM-DD" />
  </Form.Item>

  <Form.Item
    label="Аватар (URL)"
    name="avatarUrl"
    rules={[
      {
        validator: (_, value) => {
          if (!value || value.trim() === '') {
            return Promise.resolve();
          }
          try {
            new URL(value);
            return Promise.resolve();
          } catch {
            return Promise.reject('Введіть коректну URL-адресу');
          }
        },
      },
    ]}
  >
    <Input />
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
