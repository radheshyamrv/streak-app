import { useEffect, useState } from "react";
import api from "../services/api.js";
import Card from "../components/Card.jsx";

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({name:"", description:""});
  const [error, setError] = useState("");

  async function load() {
    const {data} = await api.get("/modules");
    setModules(data);
  }
  useEffect(()=>{load().catch(e=>setError(e.message))},[]);

  async function create(e) {
    e.preventDefault();
    try {
      await api.post("/modules", form);
      setForm({name:"",description:""});
      load();
    } catch(e) { setError(e.response?.data?.message || "Could not create module."); }
  }

  async function remove(id) {
    await api.delete(`/modules/${id}`);
    load();
  }

  return (
    <>
      <h1>Modules</h1>
      {error && <div className="error">{error}</div>}
      <Card title="Create module">
        <form className="form-grid" onSubmit={create}>
          <input placeholder="e.g. Studies" value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Description" value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})} />
          <button className="primary">Create</button>
        </form>
      </Card>
      <div className="task-grid">
        {modules.map(m => (
          <Card key={m._id}>
            <h3>{m.name}</h3>
            <p>{m.description || "No description."}</p>
            <div className="list-row"><span>Tasks</span><strong>{m.taskCount}</strong></div>
            <div className="list-row"><span>Average streak</span><strong>{m.averageStreak} days</strong></div>
            <button className="danger" onClick={()=>remove(m._id)}>Archive</button>
          </Card>
        ))}
      </div>
    </>
  );
}
