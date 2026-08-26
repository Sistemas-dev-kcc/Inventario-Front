import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <h1 className="text-lg font-bold">
          Inventario
        </h1>
      </div>

      <nav className="p-4 space-y-2">

        <NavItem
          to="/dashboard"
          label="Dashboard"
        />

        <NavItem
          to="/users"
          label="Usuarios"
        />

        <NavItem
          to="/equipment"
          label="Equipos"
        />

      </nav>

    </aside>
  );
}

interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({
  to,
  label
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        block px-4 py-3 rounded-lg transition
        ${
          isActive
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
        `
      }
    >
      {label}
    </NavLink>
  );
}

export default Sidebar;