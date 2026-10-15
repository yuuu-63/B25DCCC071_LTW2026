const StudentItem = ({student, onDelete }) => {
    const { id, name, score, class: className} = student;
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{score}</td>
            <td>{className}</td>
            <td>
                <button
                    className="delete-btn"
                    onClick={() => onDelete(id)}
                >
                    Xóa
                </button>    
            </td>
        </tr>
    );
};
export default StudentItem;