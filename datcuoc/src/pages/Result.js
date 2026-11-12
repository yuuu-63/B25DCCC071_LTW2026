import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ScoreChart from '../components/ScoreChart';
import { formatScore } from '../data';
import { getResult } from '../utils';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to="/" replace />;

  const { name, rounds, finalScore, correctCount, reason } = state;

  return (
    <div>
      <h2>{reason === 'broke' ? 'Bạn đã cháy túi!' : 'Bạn đã hoàn thành 12 câu.'}</h2>
      <p>Người chơi: {name}</p>
      <p>
        Số câu trả lời đúng: {correctCount}/{rounds.length}
      </p>
      <p>Điểm cuối: {formatScore(finalScore)}</p>
      <p>Đánh giá: {getResult(finalScore)}</p>

      <ScoreChart rounds={rounds} />

      <button onClick={() => navigate('/play')}>Chơi lại</button>{' '}
      <button onClick={() => navigate('/')}>Về trang chủ</button>
    </div>
  );
};

export default Result;