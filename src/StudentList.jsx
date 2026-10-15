import StudentItem from "./StudentItem";
const StudentList=({students,onDelete}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Điểm</th>
                    <th>Lớp</th>
                    <th>Thao tác</th>
                </tr>  
            </thead>
            <tbody>
                {students.map((student) => (
                    <StudentItem
                        key={student.id}
                        student={student}
                        onDelete={onDelete}
                    />
                ))}
            </tbody>
        </table>
    );
};
export default StudentList;