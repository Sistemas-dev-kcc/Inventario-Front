import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* CONTENIDO */}
            <div className="min-h-screen md:ml-64">

                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main>
                    <Outlet />
                </main>

            </div>

            {/* OVERLAY MÓVIL */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menú"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

        </div>
    );
}

export default Layout;