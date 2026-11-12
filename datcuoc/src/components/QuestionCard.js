import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';
import { questionHeading } from '../utils';
const QuestionCard = ({ question, index, total, selected, revealed, onSelect }) => {
  const getState = (i) => {
    if (!revealed) return 'idle';
    if (i === question.answer) return 'correct';
    if (i === selected) return 'wrong';
    return 'idle';
  };

  return (
    <div className="card">
      <p className="meta">{questionHeading(question, index, total)}</p>
      <h3>{question.question}</h3>
      <div className="answers">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            disabled={revealed}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;