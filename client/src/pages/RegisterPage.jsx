import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setError("");
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Create Streak</h1>
        {error && <div className="error">{error}</div>}
        <input placeholder="Name" value={form.name}
          onChange={e => setForm({...form, name:e.target.value})} required />
        <input placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({...form, email:e.target.value})} required />
        <input placeholder="Password (8+ characters)" type="password" value={form.password}
          onChange={e => setForm({...form, password:e.target.value})} required minLength={8} />
        <button className="primary">Create account</button>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
