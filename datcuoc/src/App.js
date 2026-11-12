const BUILD_TAG = "dc-2964";
/* eslint-disable import/first */
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const BOOKMARK_KEY = 'ltw_cuoc_bookmarks';
const HISTORY_KEY = 'ltw_cuoc_history';

// Đọc mảng từ localStorage, lỗi hoặc sai kiểu thì trả về mảng rỗng
const loadList = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch (err) {
    return [];
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState(() => loadList(BOOKMARK_KEY));
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => loadList(HISTORY_KEY));

  // Mounting: gọi API lấy câu hỏi
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        // Dev server có thể trả về index.html khi sai tên file
        if (!Array.isArray(res.data)) throw new Error('Dữ liệu không hợp lệ');
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError('Không tải được câu hỏi');
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Updating: lưu đánh dấu và lịch sử
  useEffect(() => {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const addHistory = (record) => setHistory((prev) => [...prev, record]);
  const clearHistory = () => setHistory([]);

  return (
    <div className="app" data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route
            index
            element={
              <Home
                playerName={playerName}
                setPlayerName={setPlayerName}
                history={history}
              />
            }
          />
          <Route
            path="play"
            element={
              <Play
                questions={questions}
                playerName={playerName}
                onFinish={addHistory}
              />
            }
          />
          <Route path="result" element={<Result />} />
          <Route
            path="history"
            element={<History history={history} onClear={clearHistory} />}
          />
          <Route
            path="questions"
            element={
              <QuestionBank
                questions={questions}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            }
          />
          <Route
            path="questions/:id"
            element={
              <QuestionDetail
                questions={questions}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;