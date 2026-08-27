import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { User } from "../types";

import UserModal from "../components/UserModal";
import ConfirmModal from "../components/ConfirmModal";
import UserDetailsModal from "../components/UserDetailsModal";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("");

  /*
    ======================================================
    VISTA
    ======================================================
    */

  const [viewMode, setViewMode] = useState<"table" | "cards">(
    window.innerWidth < 768 ? "cards" : "table",
  );

  /*
    ======================================================
    RESPONSIVE
    ======================================================
    */

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setViewMode("cards");
      } else {
        setViewMode("table");
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /*
    ======================================================
    CARGAR USUARIOS
    ======================================================
    */

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await api<User[]>("/users");

      setUsers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al cargar usuarios",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
    ======================================================
    USUARIO
    ======================================================
    */

  function handleViewUser(user: User) {
    setSelectedUser(user);
    setDetailsOpen(true);
  }

  function handleCloseDetails() {
    setDetailsOpen(false);
    setSelectedUser(null);
  }

  function handleCreate() {
    setSelectedUser(null);
    setModalOpen(true);
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedUser(null);
  }

  /*
    ======================================================
    ELIMINAR
    ======================================================
    */

  function handleDeleteClick(user: User) {
    setUserToDelete(user);
    setDeleteError("");
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (!userToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await api(`/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      setConfirmOpen(false);
      setUserToDelete(null);

      await loadUsers();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el usuario.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  /*
    ======================================================
    BUSCAR
    ======================================================
    */

  async function searchUsers(value: string) {
    setSearch(value);

    try {
      setError("");

      const endpoint = value.trim()
        ? `/users?search=${encodeURIComponent(value)}`
        : "/users";

      const data = await api<User[]>(endpoint);

      setUsers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al buscar usuarios",
      );
    }
  }

  const departments = Array.from(
    new Set(users.map((user) => user.department).filter(Boolean)),
  ).sort();

  const filteredUsers = users.filter((user) => {
    const matchesDepartment =
      !departmentFilter || user.department === departmentFilter;

    return matchesDepartment;
  });

  /*
    ======================================================
    CAMBIAR ESTADO
    ======================================================
    */

  async function toggleUserStatus(user: User) {
    try {
      setError("");

      await api(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          active: !user.active,
        }),
      });

      await loadUsers();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar el estado del usuario.",
      );
    }
  }

  /*
    ======================================================
    INICIALES
    ======================================================
    */

  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  /*
    ======================================================
    RENDER
    ======================================================
    */

  return (
    <div className="min-h-full bg-slate-50 p-3 sm:p-6 lg:p-8">
      {/* ======================================================
                HEADER
            ====================================================== */}

      <div className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm sm:h-11 sm:w-11">
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

                <circle cx="9" cy="7" r="4" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Usuarios
              </h1>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Administración y gestión de usuarios
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-slate-900
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-slate-800
                        active:scale-[0.98]
                        sm:w-auto
                    "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* ======================================================
                CONTENEDOR PRINCIPAL
            ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ======================================================
                    TOOLBAR
                ====================================================== */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* INFORMACIÓN */}

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Lista de usuarios
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredUsers.length} usuario
              {filteredUsers.length !== 1 ? "s" : ""} mostrado
              {filteredUsers.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* CONTROLES */}

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* ======================================================
            BUSCADOR
        ====================================================== */}

            <div className="relative w-full sm:w-72">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20 20-3.5-3.5"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => searchUsers(e.target.value)}
                placeholder="Buscar usuario..."
                className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-2.5
                    pl-10
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-slate-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-slate-100
                "
              />
            </div>

            {/* ======================================================
            FILTRO POR DEPARTAMENTO
        ====================================================== */}

            <div className="relative w-full sm:w-56">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                    pr-10
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-slate-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-slate-100
                "
              >
                <option value="">Todos los departamentos</option>

                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              {/* ICONO SELECT */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-400
                "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </div>

            {/* ======================================================
            CAMBIO DE VISTA
            SOLO ESCRITORIO
        ====================================================== */}

            <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 p-1 md:flex">
              {/* VISTA TABLA */}

              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Vista de tabla"
                className={`
                    flex h-9 w-10 items-center justify-center rounded-lg transition
                    ${
                      viewMode === "table"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }
                `}
              >
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
                    d="M4 5h16M4 12h16M4 19h16"
                  />
                </svg>
              </button>

              {/* VISTA TARJETAS */}

              <button
                type="button"
                onClick={() => setViewMode("cards")}
                title="Vista de tarjetas"
                className={`
                    flex h-9 w-10 items-center justify-center rounded-lg transition
                    ${
                      viewMode === "cards"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <rect x="4" y="4" width="6" height="6" rx="1" />

                  <rect x="14" y="4" width="6" height="6" rx="1" />

                  <rect x="4" y="14" width="6" height="6" rx="1" />

                  <rect x="14" y="14" width="6" height="6" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================
                    LOADING
                ====================================================== */}

        {loading && (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />

            <p className="mt-4 text-sm text-slate-500">Cargando usuarios...</p>
          </div>
        )}

        {/* ======================================================
                    ERROR
                ====================================================== */}

        {error && !loading && (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 sm:m-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 font-bold text-red-600">
                !
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  No se pudieron cargar los usuarios
                </p>

                <p className="mt-1 break-words text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
                    CONTENIDO
                ====================================================== */}

        {!loading && !error && (
          <>
            {/* ==================================================
                            TABLA
                        ================================================== */}

            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Usuario
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Departamento
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Puesto
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Equipos
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Estado
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => {
                      const equipmentCount = user.equipment?.length ?? 0;

                      return (
                        <tr
                          key={user.id}
                          className="group transition-colors hover:bg-slate-50/70"
                        >
                          {/* ==========================================
                        USUARIO
                    ========================================== */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                                {getInitials(user.name)}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {user.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ==========================================
                        DEPARTAMENTO
                    ========================================== */}

                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                              {user.department}
                            </span>
                          </td>

                          {/* ==========================================
                        PUESTO
                    ========================================== */}

                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-700">
                              {user.position || (
                                <span className="text-slate-400">
                                  Sin puesto
                                </span>
                              )}
                            </span>
                          </td>

                          {/* ==========================================
                        EQUIPOS
                    ========================================== */}

                          <td className="px-6 py-4 text-center">
                            <span
                              className={
                                equipmentCount > 0
                                  ? "inline-flex min-w-8 items-center justify-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100"
                                  : "inline-flex min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200"
                              }
                            >
                              {equipmentCount}
                            </span>
                          </td>

                          {/* ==========================================
                        ESTADO
                    ========================================== */}

                          <td className="px-6 py-4">
                            <StatusBadge active={user.active} />
                          </td>

                          {/* ==========================================
                        ACCIONES
                    ========================================== */}

                          <td className="px-6 py-4">
                            <div className="flex justify-end">
                              <ActionButtons
                                user={user}
                                onView={handleViewUser}
                                onEdit={handleEdit}
                                onToggle={toggleUserStatus}
                                onDelete={handleDeleteClick}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ==================================================
                            TARJETAS
                        ================================================== */}

            {viewMode === "cards" && (
              <div className="p-3 sm:p-5">
                {users.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        getInitials={getInitials}
                        onView={handleViewUser}
                        onEdit={handleEdit}
                        onToggle={toggleUserStatus}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================
                            SIN RESULTADOS
                        ================================================== */}

            {users.length === 0 && <EmptyState />}
          </>
        )}
      </div>

      {/* ======================================================
                MODALES
            ====================================================== */}

      <UserModal
        isOpen={modalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
        onSaved={loadUsers}
      />

      <UserDetailsModal
        isOpen={detailsOpen}
        user={selectedUser}
        onClose={handleCloseDetails}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Eliminar usuario"
        message={
          deleteError
            ? deleteError
            : `¿Estás seguro de eliminar a ${userToDelete?.name}? Esta acción no se puede deshacer.`
        }
        loading={deleteLoading}
        onClose={() => {
          if (!deleteLoading) {
            setConfirmOpen(false);
            setUserToDelete(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Users;

/*
==========================================================
STATUS BADGE
==========================================================
*/

interface StatusBadgeProps {
  active: boolean;
}

function StatusBadge({ active }: StatusBadgeProps) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Activo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Inactivo
    </span>
  );
}

/*
==========================================================
ACTION BUTTONS
==========================================================
*/

interface ActionButtonsProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggle: (user: User) => void;
  onDelete: (user: User) => void;
}

function ActionButtons({
  user,
  onView,
  onEdit,
  onToggle,
  onDelete,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {/* VER */}

      <button
        type="button"
        onClick={() => onView(user)}
        title="Ver usuario"
        aria-label="Ver usuario"
        className="
                    rounded-lg
                    p-2.5
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                    active:bg-slate-200
                "
      >
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
            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
          />

          <circle cx="12" cy="12" r="2.5" />
        </svg>
      </button>

      {/* EDITAR */}

      <button
        type="button"
        onClick={() => onEdit(user)}
        title="Editar usuario"
        aria-label="Editar usuario"
        className="
                    rounded-lg
                    p-2.5
                    text-slate-400
                    transition
                    hover:bg-blue-50
                    hover:text-blue-600
                    active:bg-blue-100
                "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
          />
        </svg>
      </button>

      {/* ACTIVAR / DESACTIVAR */}

      <button
        type="button"
        onClick={() => onToggle(user)}
        title={user.active ? "Desactivar usuario" : "Activar usuario"}
        aria-label={user.active ? "Desactivar usuario" : "Activar usuario"}
        className={
          user.active
            ? `
                            rounded-lg
                            p-2.5
                            text-slate-400
                            transition
                            hover:bg-amber-50
                            hover:text-amber-600
                            active:bg-amber-100
                        `
            : `
                            rounded-lg
                            p-2.5
                            text-slate-400
                            transition
                            hover:bg-emerald-50
                            hover:text-emerald-600
                            active:bg-emerald-100
                        `
        }
      >
        {user.active ? (
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
              d="M3 12a9 9 0 1 0 18 0"
            />

            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4" />
          </svg>
        ) : (
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
              d="m9 12.75 2.25 2.25L15 9.75"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
      </button>

      {/* ELIMINAR */}

      <button
        type="button"
        onClick={() => onDelete(user)}
        title="Eliminar usuario"
        aria-label="Eliminar usuario"
        className="
                    rounded-lg
                    p-2.5
                    text-slate-400
                    transition
                    hover:bg-red-50
                    hover:text-red-600
                    active:bg-red-100
                "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 11v6M14 11v6"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7l1 13h10l1-13M9 7V4h6v3"
          />
        </svg>
      </button>
    </div>
  );
}

/*
==========================================================
USER CARD
==========================================================
*/

interface UserCardProps {
  user: User;
  getInitials: (name: string) => string;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggle: (user: User) => void;
  onDelete: (user: User) => void;
}

function UserCard({
  user,
  getInitials,
  onView,
  onEdit,
  onToggle,
  onDelete,
}: UserCardProps) {
  const equipmentCount = user.equipment?.length ?? 0;

  return (
    <div
      className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
                sm:p-5
            "
    >
      {/* ======================================================
                HEADER CARD
            ====================================================== */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            text-sm
                            font-bold
                            text-slate-700
                            ring-1
                            ring-slate-200
                            sm:h-12
                            sm:w-12
                        "
          >
            {getInitials(user.name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {user.name}
            </h3>
          </div>
        </div>

        <div className="shrink-0">
          <StatusBadge active={user.active} />
        </div>
      </div>

      {/* ======================================================
                INFORMACIÓN
            ====================================================== */}

      <div className="mt-5 space-y-3">
        {/* DEPARTAMENTO */}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-medium text-slate-400">
            Departamento
          </span>

          <span className="break-words text-sm text-slate-700 sm:text-right">
            {user.department || "Sin departamento"}
          </span>
        </div>

        {/* PUESTO */}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-medium text-slate-400">Puesto</span>

          <span className="break-words text-sm text-slate-700 sm:text-right">
            {user.position || "Sin puesto"}
          </span>
        </div>

        {/* JEFE */}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-medium text-slate-400">Jefe</span>

          <span className="break-words text-sm text-slate-700 sm:text-right">
            {user.boss || "Sin jefe"}
          </span>
        </div>
      </div>

      {/* ======================================================
                EQUIPOS
            ====================================================== */}

      <div
        className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    bg-slate-50
                    px-4
                    py-3
                "
      >
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                        "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <rect x="3" y="4" width="18" height="13" rx="2" />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 21h8M12 17v4"
              />
            </svg>
          </div>

          <span className="truncate text-sm font-medium text-slate-600">
            Equipos asignados
          </span>
        </div>

        <span
          className="
                        inline-flex
                        min-w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-100
                        px-2.5
                        py-1
                        text-xs
                        font-bold
                        text-blue-700
                    "
        >
          {equipmentCount}
        </span>
      </div>

      {/* ======================================================
                ACCIONES
            ====================================================== */}

      <div
        className="
                    mt-5
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-slate-100
                    pt-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
      >
        <button
          type="button"
          onClick={() => onView(user)}
          className="
                        text-left
                        text-sm
                        font-medium
                        text-slate-600
                        transition
                        hover:text-slate-900
                    "
        >
          Ver detalles
        </button>

        <ActionButtons
          user={user}
          onView={onView}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

/*
==========================================================
EMPTY STATE
==========================================================
*/

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-7 w-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          />

          <circle cx="9" cy="7" r="4" />

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
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No se encontraron usuarios
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        No hay usuarios que coincidan con tu búsqueda.
      </p>
    </div>
  );
}
