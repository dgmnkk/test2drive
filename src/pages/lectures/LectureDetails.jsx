import React from "react";
import { useParams } from "react-router-dom";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const lectures = [
  { id: 1, title: "Тема 1", content: "Повний зміст лекції 1" },
  { id: 2, title: "Тема 2", content: "Повний зміст лекції 2" },
  { id: 3, title: "Тема 3", content: "Повний зміст лекції 3" },
  { id: 4, title: "Тема 4", content: "Повний зміст лекції 4" },
  { id: 5, title: "Тема 5", content: "Повний зміст лекції 5" },
  { id: 6, title: "Тема 6", content: "Повний зміст лекції 6" },
];

const LectureDetails = () => {
  const { id } = useParams();
  const lecture = lectures.find((l) => l.id === parseInt(id));

  if (!lecture) {
    return <Title level={3}>Лекцію не знайдено</Title>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title>{lecture.title}</Title>
      <Paragraph>{lecture.content}</Paragraph>
    </div>
  );
};

export default LectureDetails;
