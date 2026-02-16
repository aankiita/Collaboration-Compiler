import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/"); 
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setErrorMsg(err.response.data.msg);
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Create Account</h2>
      
      {errorMsg && <div className="mb-4 text-red-500 text-center font-bold">{errorMsg}</div>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <input type="text" name="fake_email" style={{ display: 'none' }} />
        <input type="password" name="fake_password" style={{ display: 'none' }} />
        
        <div className="input-group">
          <input 
            className="input-field" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            autoComplete="new-name"
            required
          />
        </div>
        <div className="input-group">
          <input 
            className="input-field" 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            autoComplete="off"
            name="real_email_field" 
            required
          />
        </div>
        <div className="input-group">
          <input 
            className="input-field" 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="new-password"
            name="real_password_field" 
            required
          />
        </div>
        
        <button className="btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}