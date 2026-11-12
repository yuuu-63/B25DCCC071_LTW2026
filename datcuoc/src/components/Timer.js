const Timer = ({ timeLeft }) => (
  <p className="timer" style={{ color: timeLeft <= 5 ? '#d32f2f' : 'inherit' }}>
    Còn {Math.max(0, timeLeft)} giây
  </p>
);

export default Timer;