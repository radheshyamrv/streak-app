import { useEffect, useState } from "react";
import api from "../services/api.js";
import Card from "../components/Card.jsx";
import StatCard from "../components/StatCard.jsx";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/dashboard");
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard.");
    }
  }

  useEffect(() => { load(); }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <p>Loading dashboard...</p>;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TODAY · {data.today}</p>
          <h1>Welcome back, {data.user.name}</h1>
          <p className="muted">Build consistency one deliberate day at a time.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Today's tasks" value={`${data.summary.completedToday}/${data.summary.tasks}`} />
        <StatCard label="Consistency" value={`${data.summary.consistency}%`} />
        <StatCard label="Active modules" value={data.summary.activeModules} />
        <StatCard label="Freeze periods" value={data.summary.freezePeriods} />
      </div>

      <div className="two-col">
        <Card title="Today's tasks">
          {data.tasks.length === 0 ? <p className="muted">Create your first task.</p> :
            data.tasks.map(t => (
              <div className="list-row" key={t.id}>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.module} · target {t.targetDays} days</small>
                </div>
                <span className={t.completedToday ? "pill success" : "pill"}>
                  {t.completedToday ? "Done" : `${t.streak} day streak`}
                </span>
              </div>
            ))
          }
        </Card>

        <Card title="Today's PFC challenge">
          {data.challenge ? (
            <>
              <div className="challenge-badge">{data.challenge.challenge.difficulty.toUpperCase()}</div>
              <h3>{data.challenge.challenge.title}</h3>
              <p>{data.challenge.challenge.description}</p>
              <p className="muted">{data.challenge.challenge.durationMinutes} minutes · {data.challenge.challenge.category}</p>
              <span className={data.challenge.completed ? "pill success" : "pill"}>
                {data.challenge.completed ? "Completed" : "Not completed"}
              </span>
            </>
          ) : <p className="muted">Open PFC Challenge to generate today's challenge.</p>}
        </Card>
      </div>

      <Card title="Module progress">
        {data.modules.map(m => (
          <div className="list-row" key={m.id}>
            <div><strong>{m.name}</strong><small>{m.taskCount} tasks</small></div>
            <span>{m.averageStreak} day average streak</span>
          </div>
        ))}
      </Card>
    </>
  );
}
