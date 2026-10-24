import { useEffect, useState } from "react";
import api from "../services/api.js";
import Card from "../components/Card.jsx";

export default function HistoryPage() {
  const [data, setData] = useState(null);
  useEffect(()=>{api.get("/history").then(r=>setData(r.data))},[]);

  if (!data) return <p>Loading history...</p>;

  return (
    <>
      <h1>30-Day History</h1>
      <Card title="Daily task history">
        <div className="history-table">
          {data.days.map(day => (
            <div className="history-row" key={day.date}>
              <strong>{day.date}</strong>
              <div>
                {day.tasks.map(t => (
                  <span key={t.taskId} className={`history-chip ${t.status}`}>
                    {t.taskName}: {t.status}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Freeze periods">
        {data.freezes.length ? data.freezes.map(f =>
          <div className="list-row" key={f._id}><span>{f.startDate} → {f.endDate}</span><span>{f.reason}</span></div>
        ) : <p className="muted">No freezes recorded.</p>}
      </Card>
    </>
  );
}
