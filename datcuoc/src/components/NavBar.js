import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  background: isActive ? '#1b5e20' : 'transparent',
  color: isActive ? '#fff' : '#1b5e20',
});

const NavBar = () => (
  <nav className="navbar">
    <NavLink to="/" end style={linkStyle}>
      Trang chủ
    </NavLink>
    <NavLink to="/questions" style={linkStyle}>
      Ngân hàng câu hỏi
    </NavLink>
    <NavLink to="/history" style={linkStyle}>
      Lịch sử
    </NavLink>
  </nav>
);

export default NavBar;