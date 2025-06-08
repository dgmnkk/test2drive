import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Input, Button, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { getLectureCategories } from '../../api/lecturesApi';

const { Title } = Typography;
const { Search } = Input;

const READ_LATER_KEY = 'readLaterLectures';
const VIEWED_KEY = 'viewedLectures';

const LecturesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [readLaterIds, setReadLaterIds] = useState(() => {
    const saved = localStorage.getItem(READ_LATER_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem(VIEWED_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [onlyReadLater, setOnlyReadLater] = useState(false);
  const [onlyViewed, setOnlyViewed] = useState(false);
  const [onlyUnviewed, setOnlyUnviewed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectureCategories();
        setCategories(data);
        console.log('Fetched categories:', data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const allLectures = categories.flatMap(category =>
    (category.lectures || []).map(lecture => ({
      ...lecture,
      categoryTitle: category.name,
      categoryDescription: category.description,
    }))
  );

  const toggleReadLater = (id) => {
    setReadLaterIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCardClick = (id) => {
    if (!viewedIds.includes(id)) {
      setViewedIds(prev => [...prev, id]);
    }
    navigate(`/lectures/${id}`);
  };

  useEffect(() => {
    localStorage.setItem(READ_LATER_KEY, JSON.stringify(readLaterIds));
  }, [readLaterIds]);

  useEffect(() => {
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewedIds));
  }, [viewedIds]);

  const onToggleOnlyViewed = (checked) => {
    setOnlyViewed(checked);
    if (checked) setOnlyUnviewed(false);
  };

  const onToggleOnlyUnviewed = (checked) => {
    setOnlyUnviewed(checked);
    if (checked) setOnlyViewed(false);
  };

  const filteredLectures = allLectures
    .filter(lecture => lecture && lecture.title)
    .filter(lecture =>
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(lecture => !onlyReadLater || readLaterIds.includes(lecture.id))
    .filter(lecture => !onlyViewed || viewedIds.includes(lecture.id))
    .filter(lecture => !onlyUnviewed || !viewedIds.includes(lecture.id));

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Список лекцій</Title>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}
      >
        <Search
          placeholder="Пошук за назвою"
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={onlyReadLater}
              onChange={setOnlyReadLater}
              style={{ marginRight: 8 }}
            />
            <span>Збережені</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={onlyViewed}
              onChange={onToggleOnlyViewed}
              style={{ marginRight: 8 }}
            />
            <span>Прочитані</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={onlyUnviewed}
              onChange={onToggleOnlyUnviewed}
              style={{ marginRight: 8 }}
            />
            <span>Непрочитані</span>
          </div>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>Помилка: {error}</p>}

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredLectures}
        locale={{ emptyText: loading ? 'Завантаження...' : 'Немає лекцій для відображення' }}
        renderItem={(lecture) => (
          <List.Item>
            <Card
              title={`${lecture.title} (${lecture.categoryTitle})`}
              hoverable
              onClick={() => handleCardClick(lecture.id)}
              style={{
                backgroundColor: viewedIds.includes(lecture.id) ? '#f0f0f0' : 'white'
              }}
              extra={
                <Button
                  size="small"
                  type={readLaterIds.includes(lecture.id) ? "primary" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReadLater(lecture.id);
                  }}
                >
                  {readLaterIds.includes(lecture.id) ? "Збережена" : "Зберегти"}
                </Button>
              }
            >
              {lecture.categoryDescription || 'Без опису'}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default LecturesList;
