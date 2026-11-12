import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import Supports from '../components/Supports';
import {
  START_SCORE,
  MIN_BET,
  BET_STEP,
  TIME_PER_QUESTION,
  formatScore,
} from '../data';
import {
  validateBet,
  calcChange,
  getResult,
  maxAllowedBet,
} from '../utils';

const DEFAULT_TITLE = 'Đặt cược kiến thức';

const PlayGame = ({ questions, playerName, onFinish }) => {
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
  // Quyền trợ giúp: dùng một lần mỗi lượt chơi
  const [used, setUsed] = useState({ preview: false, insurance: false, hint: false });
  // Chỉ có tác dụng cho câu đang chơi
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [insuredIndex, setInsuredIndex] = useState(-1);
  const [hintIndex, setHintIndex] = useState(-1);

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
    const insured = !correct && insuredIndex === index;
    const change = insured ? 0 : calcChange(bet, question.level, correct);
    const scoreAfter = score + change;
    setSelected(choice);
    setScore(scoreAfter);
    setRounds([
      ...rounds,
      { id: question.id, bet, correct, change, scoreAfter, insured },
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
    onFinish({
      id: Date.now(),
      name: playerName,
      finalScore: score,
      correctCount,
      played: rounds.length,
      result: getResult(score),
      playedAt: new Date().toLocaleString('vi-VN'),
    });
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

  // Phím tắt ở bước đặt cược
  useEffect(() => {
    if (status !== 'betting') return;
    const maxBet = maxAllowedBet(score);
    const handleKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const step = e.key === 'ArrowUp' ? BET_STEP : -BET_STEP;
        setBetInput((prev) =>
          String(Math.min(maxBet, Math.max(MIN_BET, (Number(prev) || 0) + step)))
        );
      } else if (e.key === 'Enter' && !e.repeat) {
        const value = Number(betInput);
        if (validateBet(value, score) === '') placeBet(value);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, betInput, score]);

  // Tiêu đề tab
  useEffect(() => {
    document.title =
      status === 'betting'
        ? `Câu ${index + 1}/${total} – đặt cược`
        : `Câu ${index + 1}/${total} – cược ${bet}`;
  }, [status, index, total, bet]);

  useEffect(() => {
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const handlePreview = () => {
    setUsed({ ...used, preview: true });
    setPreviewIndex(index);
  };
  const handleInsure = () => {
    setUsed({ ...used, insurance: true });
    setInsuredIndex(index);
  };
  const handleHint = () => {
    setUsed({ ...used, hint: true });
    setHintIndex(index);
  };

  let message = '';
  if (status === 'revealed' && lastRound) {
    if (lastRound.correct) message = `+${formatScore(lastRound.change)}`;
    else if (lastRound.insured) message = 'Bảo hiểm: không bị trừ điểm';
    else message = `−${formatScore(-lastRound.change)}`;
    if (selected === null) message = `Hết giờ! ${message}`;
  }

  return (
    <div>
      {status === 'betting' ? (
        <BetPanel
          question={question}
          index={index}
          total={total}
          score={score}
          betInput={betInput}
          onChange={setBetInput}
          onPlace={placeBet}
          previewShown={previewIndex === index}
        />
      ) : (
        <>
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
          {hintIndex === index && <p>Gợi ý: {question.hint}</p>}
          {message && <p className="result-msg">{message}</p>}
        </>
      )}
      <Supports
        status={status}
        used={used}
        insuredNow={insuredIndex === index}
        onPreview={handlePreview}
        onInsure={handleInsure}
        onHint={handleHint}
      />
    </div>
  );
};

// Chưa có tên người chơi thì không cho vào thẳng trang chơi
const Play = ({ questions, playerName, onFinish }) => {
  if (!playerName || questions.length === 0) return <Navigate to="/" replace />;
  return (
    <PlayGame questions={questions} playerName={playerName} onFinish={onFinish} />
  );
};

export default Play;
