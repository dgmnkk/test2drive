import React, { useEffect, useState } from 'react';
import { Card, Col, Progress, Row, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTests } from '../../api/testsApi';

const StatisticsPage = () => {
  const [tests, setTests] = useState([]);
  const [viewedLectures, setViewedLectures] = useState([]);
  const [readLaterLectures, setReadLaterLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = JSON.parse(sessionStorage.getItem('user'))?.email;

  useEffect(() => {
    (async () => {
      try {
        const data = await getTests();
        setTests(data);
        setViewedLectures(JSON.parse(localStorage.getItem(`viewedLectures_${email}`)) || []);
        setReadLaterLectures(JSON.parse(localStorage.getItem(`readLaterLectures_${email}`)) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  const testData = tests
    .filter(t => t.type !== 'exam')
    .map(test => {
      const score = localStorage.getItem(`testResult_${test.id}_${email}`);
      return {
        name: test.title,
        score: score ? Number(score) : 0,
      };
    });

  const examData = tests
    .filter(t => t.type === 'exam')
    .map(test => {
      const score = localStorage.getItem(`examResult_${test.id}_${email}`);
      const passed = localStorage.getItem(`examPassed_${test.id}_${email}`) === 'true';
      return {
        name: test.title,
        score: score ? Number(score) : null,
        passed,
      };
    });

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>📊 Статистика</Typography.Title>

      <Row gutter={[24, 24]}>
        <Col span={24} md={12}>
          <Card title="📚 Переглянуті лекції">
            <Progress
              percent={viewedLectures.length}
              format={() => `${viewedLectures.length} лекцій`}
              status="active"
            />
          </Card>
        </Col>

        <Col span={24} md={12}>
          <Card title="📄 Результати екзаменів">
            {examData.length === 0 ? (
              <Typography.Text>Екзамени ще не проходились</Typography.Text>
            ) : (
              examData.map((exam, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <Typography.Text>
                    {exam.name}: {exam.score !== null ? `${exam.score}% — ` : 'не пройдено '}
                    {exam.score !== null && (
                      exam.passed ? '✅ Складено' : '❌ Не складено'
                    )}
                  </Typography.Text>
                </div>
              ))
            )}
          </Card>
        </Col>
         <Col span={24} md={12}>
          <Card title="🧪 Результати тестів">
            {testData.length === 0 ? (
              <Typography.Text>Тести ще не проходились</Typography.Text>
            ) : (
              <ResponsiveContainer width="100%" height={testData.length * 50}>
                <BarChart data={testData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col span={24} md={12}>
          <Card title="🕓 Збережені лекції">
            <Progress
              percent={readLaterLectures.length}
              format={() => `${readLaterLectures.length} лекцій`}
              status="exception"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
