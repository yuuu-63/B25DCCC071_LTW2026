const COLORS = {
  idle: { background: '#f5f5f5', color: '#222' },
  correct: { background: '#43a047', color: '#fff' },
  wrong: { background: '#e53935', color: '#fff' },
};

const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button
    className="answer"
    style={COLORS[state]}
    disabled={disabled}
    onClick={onClick}
  >
    {letter}. {text}
  </button>
 );

export default AnswerButton;