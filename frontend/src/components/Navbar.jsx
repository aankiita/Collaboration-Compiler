import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();      
    navigate("/");  
  };

  return (
    <nav className="nav-container">
      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        )}
      </div>
    </nav>
  );
}