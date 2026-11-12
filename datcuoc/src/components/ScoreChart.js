import { formatScore } from '../data';

const MAX_HEIGHT = 200;

const ScoreChart = ({ rounds }) => {
  const maxScore = Math.max(1, ...rounds.map((r) => r.scoreAfter));

  return (
    <div className="chart">
      {rounds.map((r) => (
        <div className="chart-col" key={r.id}>
          <span className="chart-value">{formatScore(r.scoreAfter)}</span>
          <div
            className="chart-bar"
            style={{
              height: `${(r.scoreAfter / maxScore) * MAX_HEIGHT}px`,
              background: r.correct ? '#43a047' : '#e53935',
            }}
          />
          <span className="chart-label">Câu {r.id}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreChart;