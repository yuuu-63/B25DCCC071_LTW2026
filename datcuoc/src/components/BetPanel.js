import { formatScore } from '../data';
import { questionHeading, validateBet } from '../utils';

const BetPanel = ({
  question,
  index,
  total,
  score,
  betInput,
  onChange,
  onPlace,
}) => {
  const error = validateBet(Number(betInput), score);

  return (
    <div className="card">
      <p className="meta">{questionHeading(question, index, total)}</p>
      <p>Điểm hiện có: {formatScore(score)}</p>
      <label>
        Mức cược:{' '}
        <input
          type="number"
          value={betInput}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>{' '}
      <button disabled={error !== ''} onClick={() => onPlace(Number(betInput))}>
        Đặt cược
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default BetPanel;