import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Radio, Button, Typography, message, Row, Space, Spin,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getTestById } from '../../api/testsApi';

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    (async () => {
          try {
            const data = await getTestById(id);
            setTest(data);
            setAnswers(data.testQuestions.map(() => null));
          } catch (err) {
            message.error(err.message || 'Не вдалося завантажити тест');
          }
        })();
  }, [id]);

  useEffect(() => {
    if (!submitted) {
      const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [submitted]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      message.warning('Пройдіть всі питання');
      return;
    }
    setSubmitted(true);
    let correctCount = 0;
    test.testQuestions.forEach((q, i) => {
      const chosenOpt = q.question.options[answers[i]];
      if (chosenOpt && chosenOpt.isCorrect) correctCount++;
    });
    const percent = Math.round((correctCount / test.testQuestions.length) * 100);
    localStorage.setItem(`testResult_${id}`, `${percent}`);
    message.success(`Результат: ${percent}%`);
  };

  const handleRetry = () => {
    setAnswers(test.testQuestions.map(() => null));
    setSubmitted(false);
    setShowCorrect(false);
    setSeconds(0);
  };

  const formatTime = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2,'0')}`;

  if (!test) return <Spin />;

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <Button onClick={() => navigate('/tests')}>
        <ArrowLeftOutlined /> Назад
      </Button>

      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>{test.title}</Typography.Title>
        <div style={{
          backgroundColor: '#fff1f0',
          border: '1px solid #ff4d4f',
          borderRadius: '12px',
          padding: '5px 16px',
          alignItems: 'center',
          fontSize: '16px',
          color: '#cf1322',
          fontWeight: 600,
          height: '40px',
        }}>
          Час: {formatTime(seconds)}
        </div>
      </Row>

      {test.testQuestions.map((qItem, i) => {
        const q = qItem.question;
        return (
          <Card
            key={q.id}
            title={`${i + 1}. ${q.questionText}`}
            style={{
              marginBottom: 16,
              borderColor: showCorrect
                ? answers[i] !== null
                  ? (q.options[answers[i]].isCorrect ? 'green' : 'red') 
                  : undefined
                : undefined,
            }}
          >
            <Radio.Group
              onChange={e => handleChange(i, e.target.value)}
              value={answers[i]}
              disabled={submitted}
            >
              <Space direction="vertical">
                {q.options.map((opt, j) => (
                  <Radio key={opt.id} value={j}>
                    {opt.optionText}
                    {showCorrect && opt.isCorrect && (
                      <Typography.Text type="success" style={{ marginLeft: 8 }}>
                        (✔)
                      </Typography.Text>
                    )}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Card>
        );
      })}

      {!submitted ? (
        <Button type="primary" onClick={handleSubmit}>Завершити тест</Button>
      ) : (
        <Space direction="vertical">
          <Typography.Text strong>
            ✅ Результат: {localStorage.getItem(`testResult_${id}`)}%
          </Typography.Text>
          <Space>
            <Button onClick={() => setShowCorrect(true)}>Переглянути правильні</Button>
            <Button type="primary" onClick={handleRetry}>Почати ще раз</Button>
          </Space>
        </Space>
      )}
    </div>
  );
};

export default TestPage;
