import React from 'react'
import { List, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const lectures = [
  { id: 1, title: "Тема 1", description: "Підтема 1" },
  { id: 2, title: "Тема 2", description: "Підтема 2" },
  { id: 3, title: "Тема 3", description: "Підтема 3" },
  { id: 4, title: "Тема 4", description: "Підтема 4" },
  { id: 5, title: "Тема 5", description: "Підтема 5" },
  { id: 6, title: "Тема 6", description: "Підтема 6" },
];

const LecturesList = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Список лекцій</Title>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={lectures}
        renderItem={(lecture) => (
          <List.Item>
            <Card
              title={lecture.title}
              hoverable
              onClick={() => navigate(`/lectures/${lecture.id}`)}
            >
              {lecture.description}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default LecturesList;