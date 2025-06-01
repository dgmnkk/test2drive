import { useParams } from 'react-router-dom';
import {
    Card,
    Radio,
    Button,
    Typography,
    message,
    Row,
    Col,
    Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const mockQuestions = [
    {
        question: 'Що означає цей дорожній знак?',
        options: ['Рух заборонено', 'Головна дорога', 'Пішохідний перехід'],
        correctIndex: 1,
    },
    {
        question: 'Де дозволено зупинку?',
        options: [
            'На пішохідному переході',
            'На зупинці громадського транспорту',
            'За 10 м до пішохідного переходу',
        ],
        correctIndex: 2,
    },
];

const TestPage = () => {
    const { id } = useParams();
    const [answers, setAnswers] = useState(Array(mockQuestions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [showCorrect, setShowCorrect] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!submitted) {
            const timer = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [submitted]);

    const handleChange = (questionIndex, value) => {
        const updated = [...answers];
        updated[questionIndex] = value;
        setAnswers(updated);
    };

    const handleSubmit = () => {
        if (answers.includes(null)) {
            message.warning('Будь ласка, дайте відповідь на всі питання');
            return;
        }

        setSubmitted(true);
        const correctCount = answers.filter((a, i) => a === mockQuestions[i].correctIndex).length;
        const percent = Math.round((correctCount / mockQuestions.length) * 100);
        sessionStorage.setItem(`testResult_${id}`, `${percent}`);
        message.success(`Тест завершено. Результат: ${percent}%`);
    };

    const handleRetry = () => {
        setAnswers(Array(mockQuestions.length).fill(null));
        setSubmitted(false);
        setShowCorrect(false);
        setSeconds(0);
    };

    const score = answers.reduce(
        (acc, answer, i) => (answer === mockQuestions[i].correctIndex ? acc + 1 : acc),
        0
    );

    const formatTime = (sec) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const resultPercent = Math.round((score / mockQuestions.length) * 100);

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Button onClick={() => navigate('/tests')}>
                <ArrowLeftOutlined />
            </Button>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Typography.Title level={3}>Тест №{id}</Typography.Title>
                <div
                    style={{
                        backgroundColor: '#fff1f0',
                        border: '1px solid #ff4d4f',
                        borderRadius: '12px',
                        padding: '5px 16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '16px',
                        color: '#cf1322',
                        fontWeight: 600,
                        height: '40px',
                    }}
                >
                    Час: {formatTime(seconds)}
                </div>
            </Row>

            {mockQuestions.map((q, i) => (
                <Card
                    key={i}
                    title={`${i + 1}. ${q.question}`}
                    style={{
                        marginBottom: 16,
                        borderColor:
                            showCorrect && answers[i] !== null
                                ? answers[i] === q.correctIndex
                                    ? 'green'
                                    : 'red'
                                : undefined,
                    }}
                >
                    <Radio.Group
                        onChange={(e) => handleChange(i, e.target.value)}
                        value={answers[i]}
                        disabled={submitted}
                    >
                        <Space direction="vertical">
                            {q.options.map((opt, j) => (
                                <Radio key={j} value={j}>
                                    {opt}
                                    {showCorrect && j === q.correctIndex && (
                                        <Typography.Text type="success" style={{ marginLeft: 8 }}>
                                            (Правильна)
                                        </Typography.Text>
                                    )}
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                </Card>
            ))}

            {!submitted ? (
                <Button type="primary" onClick={handleSubmit}>
                    Завершити тест
                </Button>
            ) : (
                <Space direction="vertical">
                    <Typography.Text strong>
                        ✅ Результат: {score} з {mockQuestions.length} (
                        {resultPercent}%)
                    </Typography.Text>

                    <Space>
                        <Button onClick={() => setShowCorrect(true)}>Переглянути правильні відповіді</Button>
                        <Button color='green' variant="solid" onClick={handleRetry}>
                            Почати ще раз
                        </Button>
                    </Space>
                </Space>
            )}
        </div>
    );
};

export default TestPage;
