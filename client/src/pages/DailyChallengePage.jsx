import { useEffect, useState } from "react";
import api from "../services/api.js";
import Card from "../components/Card.jsx";

export default function DailyChallengePage() {
  const [daily, setDaily] = useState(null);
  const [history, setHistory] = useState([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [today, past] = await Promise.all([
      api.get("/challenges/today"),
      api.get("/challenges/history")
    ]);
    setDaily(today.data);
    setHistory(past.data);
  }

  useEffect(()=>{load().catch(e=>setError(e.response?.data?.message || "Could not load challenge."))},[]);

  async function complete() {
    try {
      const {data} = await api.post("/challenges/today/complete", {note});
      setDaily(data);
      load();
    } catch(e) { setError(e.response?.data?.message || "Could not complete challenge."); }
  }

  if (!daily) return <p>{error || "Loading challenge..."}</p>;
  const c = daily.challenge;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DAILY PREFRONTAL-CORTEX CHALLENGE</p>
          <h1>{c.title}</h1>
          <p className="muted">{daily.date} · {c.durationMinutes} minutes · {c.category}</p>
        </div>
        <div className="challenge-badge">{c.difficulty.toUpperCase()}</div>
      </div>

      {error && <div className="error">{error}</div>}

      <Card>
        <p className="challenge-description">{c.description}</p>
        <h3>Rules</h3>
        <ul>
          {c.rules.map(rule => <li key={rule}>{rule}</li>)}
        </ul>
        {!daily.completed ? (
          <>
            <textarea placeholder="Optional reflection" value={note} onChange={e=>setNote(e.target.value)} />
            <button className="primary" onClick={complete}>Mark challenge complete</button>
          </>
        ) : <div className="success-box">Completed. Challenge logged.</div>}
      </Card>

      <Card title="Recent challenge history">
        {history.map(item => (
          <div className="list-row" key={item._id}>
            <div>
              <strong>{item.challenge.title}</strong>
              <small>{item.date} · {item.challenge.difficulty}</small>
            </div>
            <span className={item.completed ? "pill success" : "pill"}>
              {item.completed ? "Completed" : "Missed"}
            </span>
          </div>
        ))}
      </Card>
    </>
  );
}
