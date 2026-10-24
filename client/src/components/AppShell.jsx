import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  ["/dashboard", "Dashboard"],
  ["/tasks", "Tasks"],
  ["/modules", "Modules"],
  ["/daily-challenge", "PFC Challenge"],
  ["/history", "History"],
  ["/settings", "Settings"]
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/dashboard" className="brand">Streak</NavLink>
        <nav>
          {links.map(([path, label]) => (
            <NavLink key={path} to={path} className={({isActive}) => isActive ? "nav active" : "nav"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="user-area">
          <span>{user?.name}</span>
          <button className="ghost" onClick={signOut}>Logout</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
