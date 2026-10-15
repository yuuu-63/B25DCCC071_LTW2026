import { useState} from "react";
import StudentList from "./StudentList";
import"./App.css";
const App = () => {
  const[students, setStudents] = useState([
    {id: 1, name: "Nguyễn Đình Tùng", score: 8.5, class:"D25CQCC01"},
    {id: 2, name: "Hoàng Văn Đức", score:4.0, class: "D25CQCC02"},
    {id: 3, name: "Trần Văn Toàn", score:6.0, class: "D25CQCC07"},
    {id: 4, name: "Nguyễn Đình Khánh Toàn", score: 9.0, class:"D25CQCC06"},
    {id: 5, name: "Lê Hải Hoàng", score: 8.5, class: "D25CQCC05"}
  ]);
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [className, setClassName] = useState("");
  const [filter, setFilter] = useState("all")
  const [error, setError] = useState("");
  const handleAdd =(e) => {
    e.preventDefault();
    const studentName=name.trim();
    const studentClass = className.trim();
    const studentScore = Number(score);
    if (
      !studentName || !studentClass || score.trim() === "" ||!Number.isFinite(studentScore) || studentScore<0 || studentScore>10

    ) {
      setError("Nhập đầy đủ thông tin và điểm từ 0-10");
      return;
    }
  const newStudent ={
    id: Date.now(),
    name: studentName,
    score: studentScore,
    class:studentClass,
  };
  setStudents((prevStudents) => [
    ...prevStudents,
    newStudent,
  ]);
  setName("");
  setScore("");
  setClassName("");
  setError("");
  };
  const handleDelete = (id) => {
    setStudents((prevStudents) =>
    prevStudents.filter((student) =>student.id !== id)
  );
  };
  const filteredStudents = students.filter((student) =>{
    if (filter ==="excellent") {
      return student.score >=8;
    }
    if (filter ==="failed") {
      return student.score <5;
    }
    return true;
  });
  const totalStudents = students.length;
  const averageScore =
    totalStudents === 0
      ? 0
      : students.reduce(
          (total, student) => total + student.score,
          0
        ) / totalStudents;
 return (
  <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>

      {}
      <form onSubmit={handleAdd} className="student-form">
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Điểm (0 - 10)"
          min="0"
          max="10"
          step="any"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lớp"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <button type="submit">Thêm sinh viên</button>
      </form>

      {error && <p className="error">{error}</p>}

      {}
      <div className="filter-group">
        <button
          type="button"
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>

        <button
          type="button"
          onClick={() => setFilter("excellent")}
        >
          Sinh viên Giỏi (≥ 8)
        </button>

        <button
          type="button"
          onClick={() => setFilter("failed")}
        >
          Trượt môn (&lt; 5)
        </button>
      </div>

      {}
      <div className="statistics">
        <p>Tổng số sinh viên: {totalStudents}</p>
        <p>
          Điểm trung bình: {averageScore.toFixed(2)}
        </p>
      </div>

      {}
      <StudentList
        students={filteredStudents}
        onDelete={handleDelete}
      />

      {filteredStudents.length === 0 && (
        <p>Không có sinh viên phù hợp.</p>
      )}
    </div>
 );       
};
export default App;