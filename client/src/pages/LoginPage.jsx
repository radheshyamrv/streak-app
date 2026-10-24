import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setError("");
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Streak</h1>
        <p className="muted">Consistency over motivation.</p>
        {error && <div className="error">{error}</div>}
        <input placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({...form, email:e.target.value})} required />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({...form, password:e.target.value})} required />
        <button className="primary">Login</button>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
