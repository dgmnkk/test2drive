import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getLectureById } from "../../api/lecturesApi";

const { Title, Paragraph } = Typography;
export const imageFixMap = {
  "https://pdr.net.ua/wp-content/uploads/2020/09/1.1.png": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/1.1.svg",
  "https://pdr.net.ua/wp-content/uploads/2020/09/1.11.png": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/1.10.svg",
  "https://pdr.net.ua/wp-content/uploads/2020/09/3.1.png": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/3.21.svg",
  "https://pdr.net.ua/wp-content/uploads/2020/09/3.2.png": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/3.2.svg",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b1/c28/thumb_66_1000_1000_0_0_crop.jpg": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/3.29.svg",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b1/d09/thumb_87_1000_1000_0_0_crop.jpg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0k6oFS-TU6WyMjHzqYjK-tVHMAepPYJxaog&s",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b1/ea5/thumb_116_800_800_0_0_crop.jpg": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/3.34.svg",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b1/eaa/thumb_117_800_800_0_0_crop.jpg": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/3.35.svg",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b1/f0c/thumb_133_1000_1000_0_0_crop.jpg": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/1.27.svg",
  "https://pdr.net.ua/storage/app/uploads/public/5de/596/f3d/thumb_1_1000_1000_0_0_crop.jpg": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/znaki/1.24.svg",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b2/004/thumb_165_1000_1000_0_0_crop.jpg": "https://green-way.com.ua/storage/app/media/books/pdd-ukr/razdel_8/8-8-v-sygnaly-reguljuvalnyka5.jpg",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b2/03a/thumb_170_1000_1000_0_0_crop.jpg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVn5gQr5iub7q3077emBxW6zA2-RiSQqvq0A&s",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b1/ccc/thumb_59_1000_1000_0_0_crop.jpg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDcw4G4H0wP93YuJZca2aekQusg9zhaNAXaw&s",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b2/056/thumb_195_1000_1000_0_0_crop.jpg": "https://lh5.googleusercontent.com/proxy/P13R9b-JSIWnhr0NZOEZqLarPMhUnL0GOCaP7XFuwWkYS5DJx5oqhJVCctSjM5q8pCBCqg1MGLwuriA2mOuykRg0b_DkKCaJzf-eBj7hz_NGJVGF9_gr",
  "https://pdr.net.ua/storage/app/uploads/public/5dd/1b2/1f6/thumb_228_1000_1000_0_0_crop.jpg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOoIIb6Kv309FAEM_17bt-p_fDEvxaynQ-Lg&s"
};

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
        console.log("Lecture data:", data);
        setLecture(data);
      } catch (err) {
        setError("Не вдалося завантажити лекцію");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);
  const replaceImageUrls = (html) => {
    let fixedHtml = html;
    Object.entries(imageFixMap).forEach(([badUrl, goodUrl]) => {
      fixedHtml = fixedHtml.replaceAll(badUrl, goodUrl);
    });
    return fixedHtml;
  };

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
          ? <span dangerouslySetInnerHTML={{
            __html: lecture.content ? replaceImageUrls(lecture.content) : 'Опису немає',
          }} />
          : "Опису немає"}
      </Paragraph>
    </div>
  );
};

export default LectureDetails;
