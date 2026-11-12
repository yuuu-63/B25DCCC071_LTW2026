import { useState } from 'react';
import { formatScore } from '../data';

const History = ({ history, onClear }) => {
  const [player, setPlayer] = useState('');

  const players = [...new Set(history.map((h) => h.name))];
  const visible = history.filter((h) => player === '' || h.name === player);
  const sorted = [...visible].sort((a, b) => b.finalScore - a.finalScore);

  const highest = visible.reduce((max, h) => Math.max(max, h.finalScore), 0);
  const brokeCount = visible.filter((h) => h.result === 'Cháy túi').length;

  const handleClear = () => {
    onClear();
    setPlayer('');
  };

  if (history.length === 0) {
    return (
      <div>
        <h2>Lịch sử</h2>
        <p>Chưa có lượt chơi nào</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Lịch sử</h2>

      <label>
        Người chơi:{' '}
        <select value={player} onChange={(e) => setPlayer(e.target.value)}>
          <option value="">Tất cả</option>
          {players.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>{' '}
      <button onClick={handleClear}>Xóa lịch sử</button>

      <p>Số lượt chơi: {visible.length}</p>
      <p>Điểm cao nhất: {formatScore(highest)}</p>
      <p>Số lần cháy túi: {brokeCount}</p>

      <table>
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Điểm cuối</th>
            <th>Đánh giá</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>
                {h.correctCount}/{h.played}
              </td>
              <td>{formatScore(h.finalScore)}</td>
              <td>{h.result}</td>
              <td>{h.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;