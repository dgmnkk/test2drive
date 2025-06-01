import React from 'react';
import { Card, Button, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const tests = [
  { id: 1, title: 'Правила дорожнього руху' },
  { id: 2, title: 'Дорожні знаки' },
  { id: 3, title: 'Безпека на дорозі' },
];

const TestsPage = () => {
  const navigate = useNavigate();

  const getTestResult = (id) => {
    const result = sessionStorage.getItem(`testResult_${id}`);
    return result ? Number(result) : null;
  };

  const startTest = (id) => {
    navigate(`/tests/${id}`);
  };

  return (
    <div style={{ padding: '32px' }}>
      <Typography.Title level={2}>📋 Список тестів</Typography.Title>
      <Row gutter={[16, 16]}>
        {tests.map((test) => {
          const score = getTestResult(test.id);
          const isCompleted = score !== null;

          return (
            <Col key={test.id} xs={24} sm={12} md={8}>
              <Card
                title={test.title}
                style={{
                  backgroundColor: isCompleted ? '#f5f5f5' : '#fff',
                  color: isCompleted ? '#999' : undefined,
                  border: isCompleted ? '1px solid #d9d9d9' : undefined,
                }}
              >
                {isCompleted && (
                  <Typography.Text type="secondary">
                    ✅ Завершено. Результат: {score}%
                  </Typography.Text>
                )}
                <div style={{ marginTop: 12 }}>
                  <Button type="primary" onClick={() => startTest(test.id)}>
                    Почати тестування
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default TestsPage;
