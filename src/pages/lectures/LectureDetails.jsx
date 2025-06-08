import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getLectureById } from "../../api/lecturesApi";

const { Title, Paragraph } = Typography;

const LectureDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const data = await getLectureById(id);
        setLecture(data);
      } catch (err) {
        setError("Не вдалося завантажити лекцію");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  if (loading) return <Spin tip="Завантаження..." />;
  if (error) return <Title level={3}>{error}</Title>;
  if (!lecture) return <Title level={3}>Лекцію не знайдено</Title>;

  return (
    <div style={{ padding: "24px" }}>
      <Button onClick={() => navigate("/lectures")}>
        <ArrowLeftOutlined /> Назад
      </Button>
      <Paragraph>
        {lecture.content
          ? <span dangerouslySetInnerHTML={{ __html: lecture.content }} />
          : "Опису немає"}
      </Paragraph>
    </div>
  );
};

export default LectureDetails;
