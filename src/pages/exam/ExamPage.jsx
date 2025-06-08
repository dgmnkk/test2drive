import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card, Radio, Button, Typography, message, Row, Space, Modal, Spin,
} from 'antd';
import { getTestById } from '../../api/testsApi';

const ExamPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const email = sessionStorage.getItem('email');
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getTestById(id);
                setExam(data);
                setAnswers(data.testQuestions.map(() => null));
                if (data.timeLimitMinutes) {
                    setTimeLeft(data.timeLimitMinutes * 60);
                }
            } catch (err) {
                message.error(err.message || 'Не вдалося завантажити екзамен');
            }
        })();
    }, [id]);

    useEffect(() => {
        if (!submitted && timeLeft !== null) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit(true); // Автоматичне завершення
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [submitted, timeLeft]);

    const formatTime = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

    const handleChange = (index, value) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleSubmit = (auto = false) => {
        if (!auto && answers.includes(null)) {
            message.warning('Пройдіть всі питання');
            return;
        }

        setSubmitted(true);

        let correct = 0;
        exam.testQuestions.forEach((q, i) => {
            const chosen = q.question.options[answers[i]];
            if (chosen && chosen.isCorrect) correct++;
        });

        const score = Math.round((correct / exam.testQuestions.length) * 100);
        const passed = score >= exam.passingScorePercentage;
        
        localStorage.setItem(`examResult_${exam.id}_${email}`, score.toString());
        localStorage.setItem(`examPassed_${exam.id}_${email}`, passed.toString());

        Modal.info({
            title: passed ? '✅ Ви склали екзамен' : '❌ Екзамен не складено',
            content: (
                <>
                    <p>Ваш результат: {score}%</p>
                    <p>Необхідно для проходження: {exam.passingScorePercentage}%</p>
                    {auto && <p style={{ color: 'red' }}>Час вичерпано!</p>}
                </>
            ),
            okText: 'Назад до екзаменів',
            onOk: () => navigate('/exams'),
        });
    };

    if (!exam) return <Spin />;

    return (
        <div style={{ padding: 24 }}>
            <Typography.Title level={3}>{exam.title}</Typography.Title>
            <Typography.Paragraph>{exam.description}</Typography.Paragraph>

            {timeLeft !== null && !submitted && (
                <div style={{
                    marginBottom: 16,
                    padding: '5px 16px',
                    backgroundColor: '#fff1f0',
                    border: '1px solid #ff4d4f',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: 16,
                    width: 'fit-content',
                }}>
                    ⏳ Залишилось часу: {formatTime(timeLeft)}
                </div>
            )}

            {exam.testQuestions.map((qItem, i) => (
                <Card key={qItem.question.id} title={`${i + 1}. ${qItem.question.questionText}`} style={{ marginBottom: 16 }}>
                    <Radio.Group
                        onChange={e => handleChange(i, e.target.value)}
                        value={answers[i]}
                        disabled={submitted}
                    >
                        <Space direction="vertical">
                            {qItem.question.options.map((opt, j) => (
                                <Radio key={opt.id} value={j}>{opt.optionText}</Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                </Card>
            ))}

            {!submitted && (
                <Button type="primary" onClick={() => handleSubmit(false)}>Завершити екзамен</Button>
            )}
        </div>
    );
};

export default ExamPage;
