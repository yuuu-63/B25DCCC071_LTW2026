import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';

const QuestionBank = ({ questions, bookmarks, toggleBookmark }) => {
  const [levels, setLevels] = useState([1, 2, 3]);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [keyword, setKeyword] = useState('');

  const toggleLevel = (level) => {
    if (levels.includes(level)) {
      setLevels(levels.filter((l) => l !== level));
    } else {
      setLevels([...levels, level]);
    }
  };

  const handleLookupShift = (e) => setKeyword(e.target.value);

  const visible = questions.filter(
    (q) =>
      levels.includes(q.level) &&
      (!onlyBookmarked || bookmarks.includes(q.id)) &&
      q.question.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters">
        {Object.entries(LEVELS).map(([level, label]) => (
          <label key={level}>
            <input
              type="checkbox"
              checked={levels.includes(Number(level))}
              onChange={() => toggleLevel(Number(level))}
            />{' '}
            {label}
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            checked={onlyBookmarked}
            onChange={(e) => setOnlyBookmarked(e.target.checked)}
          />{' '}
          Chỉ hiện câu đã đánh dấu
        </label>
      </div>

      <input
        type="text"
        className="search"
        placeholder="Tìm kiếm theo nội dung câu hỏi"
        value={keyword}
        onChange={handleLookupShift}
      />

      <p>Có {visible.length} câu hỏi</p>
      <p>Đã đánh dấu: {bookmarks.length} câu</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Chủ đề</th>
            <th>Mức độ</th>
            <th>Hệ số</th>
            <th>Câu hỏi</th>
            <th>Đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.topic}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
              <td>
                <button
                  className="star"
                  onClick={() => toggleBookmark(q.id)}
                  aria-label="Đánh dấu"
                >
                  {bookmarks.includes(q.id) ? '★' : '☆'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;