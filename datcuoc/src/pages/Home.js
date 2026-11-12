import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  TIME_PER_QUESTION,
  formatScore,
} from '../data';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(playerName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') return;
    setPlayerName(name.trim());
    navigate('/play');
  };

  return (
    <div>
      <h1>Đặt cược kiến thức</h1>
      <ul>
        <li>Bạn bắt đầu với {formatScore(START_SCORE)} và đi qua 12 câu hỏi.</li>
        <li>
          Trước mỗi câu chỉ biết chủ đề và mức độ, hãy đặt cược từ {MIN_BET} đến{' '}
          {MAX_BET} điểm.
        </li>
        <li>Mỗi câu có {TIME_PER_QUESTION} giây để trả lời.</li>
        <li>Đúng: thưởng mức cược nhân hệ số. Sai hoặc hết giờ: mất số điểm đã cược.</li>
        <li>Còn dưới {MIN_BET} điểm là cháy túi, lượt chơi kết thúc.</li>
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{' '}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>{' '}
        <button type="submit" disabled={name.trim() === ''}>
          Vào chơi
        </button>
      </form>
    </div>
  );
};

export default Home;