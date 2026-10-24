export default function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="muted">{label}</div>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}
