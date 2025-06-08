import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Typography, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getTests } from '../../api/testsApi';

const ExamsList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getTests();
        setTests(data.filter(test => test.type == 'exam'));
      } catch (err) {
        message.error(err.message || 'Не вдалося завантажити екзамени');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getTestResult = (id) => {
    const result = localStorage.getItem(`testResult_${id}`);
    return result ? Number(result) : null;
  };

  const getTestPassed = (id) => {
    const result = localStorage.getItem(`testPassed_${id}`);
    return result ? '✅ Ви склали екзамен' : '❌ Екзамен не складено';
  };

  return (
    <div style={{ padding: 32 }}>
      <Typography.Title level={2}>📋 Список екзаменів</Typography.Title>

      {loading ? <Spin /> : (
        <Row gutter={[16, 16]}>
          {tests.map(test => {
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
                    <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column' }}>
                        <Typography.Text type="secondary">
                        ✅ Завершено. Результат: {score}%
                        </Typography.Text>
                        <Typography.Text type="secondary">
                            {getTestPassed(test.id)}
                        </Typography.Text>
                    </div>
                  )}
                  <div style={{ marginTop: 12 }}>
                    <Button
                      type="primary"
                      onClick={() => navigate(`/exams/${test.id}`)}
                    >
                      Почати екзамен
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default ExamsList;
