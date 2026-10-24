import { useEffect, useState } from "react";
import api from "../services/api.js";
import Card from "../components/Card.jsx";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", moduleId: "", targetDays: 30 });
  const [error, setError] = useState("");

  async function load() {
    const [t, m] = await Promise.all([api.get("/tasks"), api.get("/modules")]);
    setTasks(t.data); setModules(m.data);
    if (!form.moduleId && m.data[0]) setForm(f => ({...f, moduleId:m.data[0]._id}));
  }

  useEffect(() => { load().catch(e => setError(e.response?.data?.message || "Load failed.")); }, []);

  async function create(e) {
    e.preventDefault();
    try {
      await api.post("/tasks", form);
      setForm({...form, name:"", description:""});
      await load();
    } catch (e) { setError(e.response?.data?.message || "Could not create task."); }
  }

  async function complete(id) {
    try { await api.post(`/tasks/${id}/complete`); await load(); }
    catch (e) { setError(e.response?.data?.message || "Could not complete task."); }
  }

  async function cheat(id) {
    try { await api.post(`/tasks/${id}/cheat`); await load(); }
    catch (e) { setError(e.response?.data?.message || "Cheat day unavailable."); }
  }

  async function remove(id) {
    if (!confirm("Archive this task?")) return;
    await api.delete(`/tasks/${id}`);
    await load();
  }

  return (
    <>
      <h1>Tasks</h1>
      {error && <div className="error">{error}</div>}

      <Card title="Create task">
        <form className="form-grid" onSubmit={create}>
          <input placeholder="Task name" value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Description" value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})} />
          <select value={form.moduleId} onChange={e=>setForm({...form,moduleId:e.target.value})} required>
            <option value="">Select module</option>
            {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <input type="number" min="1" value={form.targetDays}
            onChange={e=>setForm({...form,targetDays:Number(e.target.value)})} />
          <button className="primary">Create task</button>
        </form>
      </Card>

      <div className="task-grid">
        {tasks.map(t => (
          <Card key={t._id}>
            <div className="task-head">
              <div>
                <h3>{t.name}</h3>
                <small>{t.module?.name}</small>
              </div>
              <span className="streak-number">{t.stats.currentStreak}🔥</span>
            </div>
            <p>{t.description || "No description."}</p>
            <div className="progress"><span style={{width:`${t.stats.targetProgress}%`}} /></div>
            <p className="muted">{t.stats.currentStreak}/{t.stats.targetDays} target days · longest {t.stats.longestStreak}</p>
            <div className="actions">
              <button className="primary" onClick={()=>complete(t._id)}>Complete today</button>
              <button onClick={()=>cheat(t._id)}>Use cheat day</button>
              <button className="danger" onClick={()=>remove(t._id)}>Archive</button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
