import { useState } from "react";
import api from "../services/api.js";
import Card from "../components/Card.jsx";

export default function SettingsPage() {
  const [form, setForm] = useState({startDate:"",days:2,reason:""});
  const [message, setMessage] = useState("");

  async function freeze(e) {
    e.preventDefault();
    try {
      const {data} = await api.post("/freezes", form);
      setMessage(data.message);
    } catch(e) {
      setMessage(e.response?.data?.message || "Freeze request failed.");
    }
  }

  return (
    <>
      <h1>Settings</h1>
      <Card title="Streak freeze">
        <p className="muted">
          A freeze requires 10 continuous qualifying days immediately before the
          start date, lasts 2–3 days, requires a reason, and only one freeze
          period may start in a rolling 30-day window.
        </p>
        {message && <div className="notice">{message}</div>}
        <form className="form-grid" onSubmit={freeze}>
          <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} required />
          <select value={form.days} onChange={e=>setForm({...form,days:Number(e.target.value)})}>
            <option value={2}>2 days</option>
            <option value={3}>3 days</option>
          </select>
          <textarea placeholder="Reason (required)" value={form.reason}
            onChange={e=>setForm({...form,reason:e.target.value})} required />
          <button className="primary">Request freeze</button>
        </form>
      </Card>
    </>
  );
}
