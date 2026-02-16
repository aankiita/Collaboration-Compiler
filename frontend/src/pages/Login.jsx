import { useState, useContext,useEffect } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    setEmail("");
    setPassword("");
    setErrorMsg("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setShowRegister(false); 

    try {
      const res = await axios.post("https://collaboration-compiler-1.onrender.com/api/auth/login", { 
    email, 
    password 
});
      // const res = await API.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/dashboard", { state: { username: res.data.name|| email } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        const msg = err.response.data.msg;
        setErrorMsg(msg);
        if (msg === "User not found" || msg === "User already exists") {
          setShowRegister(true);
        }
      } else {
        setErrorMsg("Login failed. Please check your connection.");
      }
    }
  };
  

  return (
    <div className="auth-card">
      <h2 className="auth-title">Welcome Back</h2>
      
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="input-group">
          <input
            className="input-field"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="login_email_unique" 
            autoComplete="new-email"
            required
          />
        </div>

       
        <div className="input-group relative">
          <input
          
            type={showPassword ? "text" : "password"}
            className="input-field pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="login_password_unique"
            autoComplete="new-password"
            required
          />
          
        
          <button
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
             
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
            
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 text-center">
            <p className="text-red-500 font-bold mb-2">{errorMsg}</p>
            {showRegister && (
              <Link to="/register">
                <button type="button" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full transition-colors">
                  Create an Account
                </button>
              </Link>
            )}
          </div>
        )}

        {!showRegister && (
            <button className="btn-primary">
            Login to Dashboard
            </button>
        )}
      </form>
    </div>
  );
}