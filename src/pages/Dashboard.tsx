import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { DashboardData } from "../types";

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CARGAR DASHBOARD
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const result = await api<DashboardData>("/dashboard");

      setData(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al cargar dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <DashboardSkeleton />;
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 font-bold text-red-600">
                !
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-red-800 sm:text-base">
                  No se pudo cargar el dashboard
                </h2>

                <p className="mt-1 break-words text-sm text-red-600">
                  {error}
                </p>

                <button
                  onClick={loadDashboard}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
                >
                  <RefreshIcon />
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // ==========================================
  // PORCENTAJES
  // ==========================================

  const assignedPercentage =
    data.equipment.total > 0
      ? Math.round(
          (data.equipment.assigned / data.equipment.total) * 100
        )
      : 0;

  const warehousePercentage =
    data.equipment.total > 0
      ? Math.round(
          (data.equipment.warehouse / data.equipment.total) * 100
        )
      : 0;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <DashboardIcon />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                  Dashboard
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Resumen general del inventario
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={loadDashboard}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
          >
            <RefreshIcon />
            Actualizar
          </button>
        </div>

        {/* ==========================================
            USUARIOS
        ========================================== */}

        <section className="mb-8">
          <SectionHeader
            title="Usuarios"
            description="Resumen de usuarios registrados"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total usuarios"
              value={data.users.total}
              icon={<UsersIcon />}
              description="Usuarios registrados"
              iconClass="bg-slate-100 text-slate-700"
            />

            <StatCard
              title="Usuarios activos"
              value={data.users.active}
              icon={<CheckIcon />}
              description="Usuarios actualmente activos"
              iconClass="bg-emerald-50 text-emerald-600"
              valueClass="text-emerald-700"
            />

            <StatCard
              title="Usuarios inactivos"
              value={data.users.inactive}
              icon={<MinusIcon />}
              description="Usuarios desactivados"
              iconClass="bg-slate-100 text-slate-500"
              valueClass="text-slate-600"
            />
          </div>
        </section>

        {/* ==========================================
            EQUIPOS
        ========================================== */}

        <section>
          <SectionHeader
            title="Equipos"
            description="Estado actual del inventario"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total"
              value={data.equipment.total}
              icon={<ComputerIcon />}
              description="Equipos registrados"
              iconClass="bg-slate-100 text-slate-700"
            />

            <StatCard
              title="Asignados"
              value={data.equipment.assigned}
              icon={<UserIcon />}
              description={`${assignedPercentage}% del inventario`}
              iconClass="bg-blue-50 text-blue-600"
              valueClass="text-blue-700"
            />

            <StatCard
              title="Almacén"
              value={data.equipment.warehouse}
              icon={<BoxIcon />}
              description={`${warehousePercentage}% del inventario`}
              iconClass="bg-purple-50 text-purple-600"
              valueClass="text-purple-700"
            />
          </div>

          {/* ==========================================
              RESUMEN DE ASIGNACIÓN
          ========================================== */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Asignación de equipos
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Equipos asignados respecto al total
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {assignedPercentage}%
                </span>

                <span className="text-xs font-medium text-slate-400">
                  asignado
                </span>
              </div>
            </div>

            {/* BARRA */}

            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-800 transition-all duration-500"
                style={{
                  width: `${assignedPercentage}%`,
                }}
              />
            </div>

            {/* INFORMACIÓN */}

            <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-800" />

                <span>
                  {data.equipment.assigned} equipos asignados
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" />

                <span>
                  {data.equipment.warehouse} equipos en almacén
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ======================================================
// SECTION HEADER
// ======================================================

interface SectionHeaderProps {
  title: string;
  description: string;
}

function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

// ======================================================
// STAT CARD
// ======================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  iconClass?: string;
  valueClass?: string;
}

function StatCard({
  title,
  value,
  icon,
  description,
  iconClass = "bg-slate-100 text-slate-700",
  valueClass = "text-slate-900",
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold tracking-tight ${valueClass}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-4 truncate text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

// ======================================================
// LOADING SKELETON
// ======================================================

function DashboardSkeleton() {
  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

            <div>
              <div className="h-7 w-36 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

        </div>

        {/* SECCIONES */}

        {[1, 2].map((section) => (
          <section key={section} className="mb-8">

            <div className="mb-4">
              <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-4 w-52 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                      <div className="mt-3 h-9 w-16 animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />
                  </div>

                  <div className="mt-4 h-3 w-36 animate-pulse rounded bg-slate-100" />
                </div>
              ))}

            </div>
          </section>
        ))}

        {/* BARRA */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="h-7 w-12 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-5 h-3 w-full animate-pulse rounded-full bg-slate-100" />

        </div>

      </div>
    </div>
  );
}

// ======================================================
// ICONS
// ======================================================

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11a8.1 8.1 0 0 0-14.9-3.8L3 10"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5v5h5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 13a8.1 8.1 0 0 0 14.9 3.8L21 14"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 19v-5h-5"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
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
        d="m5 12 4 4L19 6"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
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
        d="M5 12h14"
      />
    </svg>
  );
}

function ComputerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 21h8M12 17v4"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 21a8 8 0 0 1 16 0"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 7.5 8 4.5 8-4.5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12v9"
      />
    </svg>
  );
}

export default Dashboard;

