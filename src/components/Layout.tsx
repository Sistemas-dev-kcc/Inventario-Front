import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Header />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;