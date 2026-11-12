import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import { START_SCORE, MIN_BET, TIME_PER_QUESTION, formatScore } from '../data';
import { calcChange } from '../utils';

const PlayGame = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [rounds, setRounds] = useState([]);
  // "betting" -> "answering" -> "revealed" -> "betting" -> ...
  const [status, setStatus] = useState('betting');
  const [betInput, setBetInput] = useState(String(MIN_BET));
  const [bet, setBet] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];
  const lastRound = rounds[rounds.length - 1];

  const placeBet = (value) => {
    setBet(value);
    setTimeLeft(TIME_PER_QUESTION);
    setStatus('answering');
  };

  // Lộ kết quả: chọn đáp án (choice) hoặc hết giờ (choice = null)
  const finish = (choice) => {
    const correct = choice === question.answer;
    const change = calcChange(bet, question.level, correct);
    const scoreAfter = score + change;
    setSelected(choice);
    setScore(scoreAfter);
    setRounds([
      ...rounds,
      { id: question.id, bet, correct, change, scoreAfter },
    ]);
    setStatus('revealed');
  };

  const nextQuestion = () => {
    setIndex(index + 1);
    setSelected(null);
    setBetInput(String(MIN_BET));
    setStatus('betting');
  };

  const endGame = () => {
    const correctCount = rounds.filter((r) => r.correct).length;
    const reason = score < MIN_BET ? 'broke' : 'done';
    navigate('/result', {
      replace: true,
      state: { name: playerName, rounds, finalScore: score, correctCount, reason },
    });
  };

  // Bước chờ 2 giây sau khi lộ kết quả
  useEffect(() => {
    if (status !== 'revealed') return;
    const timeoutId = setTimeout(() => {
      if (score < MIN_BET || index + 1 >= total) endGame();
      else nextQuestion();
    }, 2000);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const intervalId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalId);
  }, [status]);

  // Hết giờ: tính như trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) finish(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  let message = '';
  if (status === 'revealed' && lastRound) {
    message = lastRound.correct
      ? `+${formatScore(lastRound.change)}`
      : `−${formatScore(-lastRound.change)}`;
    if (selected === null) message = `Hết giờ! ${message}`;
  }

  if (status === 'betting') {
    return (
      <BetPanel
        question={question}
        index={index}
        total={total}
        score={score}
        betInput={betInput}
        onChange={setBetInput}
        onPlace={placeBet}
      />
    );
  }

  return (
    <div>
      <Timer timeLeft={timeLeft} />
      <ScoreInfo score={score} bet={bet} />
      <QuestionCard
        question={question}
        index={index}
        total={total}
        selected={selected}
        revealed={status === 'revealed'}
        onSelect={finish}
      />
      {message && <p className="result-msg">{message}</p>}
    </div>
  );
};

// Chưa có tên người chơi thì không cho vào thẳng trang chơi
const Play = ({ questions, playerName }) => {
  if (!playerName || questions.length === 0) return <Navigate to="/" replace />;
  return <PlayGame questions={questions} playerName={playerName} />;
};

export default Play;