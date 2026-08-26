import { NavLink } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function Sidebar({
    isOpen,
    onClose
}: SidebarProps) {

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50
                w-64
                bg-slate-900
                text-white
                flex flex-col
                transform transition-transform duration-300 ease-in-out

                md:translate-x-0

                ${isOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
            `}
        >

            {/* HEADER SIDEBAR */}

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-700 px-6">

                <h1 className="text-lg font-bold">
                    Inventario
                </h1>

                {/* CERRAR EN MÓVIL */}

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
                    aria-label="Cerrar menú"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6l12 12M18 6 6 18"
                        />
                    </svg>
                </button>

            </div>

            {/* NAVEGACIÓN */}

            <nav className="flex-1 space-y-2 overflow-y-auto p-4">

                <NavItem
                    to="/dashboard"
                    label="Dashboard"
                    onClick={onClose}
                />

                <NavItem
                    to="/users"
                    label="Usuarios"
                    onClick={onClose}
                />

                <NavItem
                    to="/equipment"
                    label="Equipos"
                    onClick={onClose}
                />

            </nav>

        </aside>
    );
}

interface NavItemProps {
    to: string;
    label: string;
    onClick: () => void;
}

function NavItem({
    to,
    label,
    onClick
}: NavItemProps) {

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `
                block rounded-lg px-4 py-3
                transition

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