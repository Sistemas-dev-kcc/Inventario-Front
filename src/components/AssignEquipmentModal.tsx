import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Equipment, User } from "../types";

interface AssignEquipmentModalProps {
  isOpen: boolean;
  equipment: Equipment | null;
  onClose: () => void;
  onAssigned: () => void;
}

function AssignEquipmentModal({
  isOpen,
  equipment,
  onClose,
  onAssigned
}: AssignEquipmentModalProps) {

  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState("");

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    setSearch("");
    setError("");

    setSelectedUserId(
      equipment?.userId ?? ""
    );

    loadUsers("");

  }, [isOpen, equipment]);

  async function loadUsers(
    searchValue: string
  ) {

    try {

      setLoadingUsers(true);

      const endpoint = searchValue.trim()
        ? `/users?search=${encodeURIComponent(searchValue)}`
        : "/users";

      const data = await api<User[]>(endpoint);

      setUsers(
        data.filter((user) => user.active)
      );

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los usuarios."
      );

    } finally {

      setLoadingUsers(false);

    }
  }

  async function handleAssign() {

    if (!equipment) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      if (!selectedUserId) {

        await api(
          `/equipment/${equipment.id}/unassign`,
          {
            method: "PATCH"
          }
        );

      } else {

        await api(
          `/equipment/${equipment.id}/assign`,
          {
            method: "PATCH",
            body: JSON.stringify({
              userId: selectedUserId
            })
          }
        );

      }

      onAssigned();
      onClose();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo asignar el equipo."
      );

    } finally {

      setLoading(false);

    }
  }

  if (!isOpen || !equipment) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
    >

      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-4 border-b">

          <div>

            <h2 className="text-lg font-semibold">
              {equipment.user
                ? "Cambiar usuario"
                : "Asignar equipo"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {equipment.hostname}
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div className="p-6">

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium mb-2">
            Buscar usuario
          </label>

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              loadUsers(e.target.value);
            }}
            placeholder="Nombre o email..."
            className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
          />

          <div className="mt-4 max-h-64 overflow-y-auto border rounded-lg">

            {loadingUsers && (
              <p className="p-4 text-sm text-gray-500">
                Cargando usuarios...
              </p>
            )}

            {!loadingUsers &&
              users.map((user) => (

                <label
                  key={user.id}
                  className="flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                >

                  <input
                    type="radio"
                    name="selectedUser"
                    value={user.id}
                    checked={
                      selectedUserId === user.id
                    }
                    onChange={(e) =>
                      setSelectedUserId(
                        e.target.value
                      )
                    }
                  />

                  <div>

                    <p className="text-sm font-medium">
                      {user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>

                  </div>

                </label>

              ))}

            {!loadingUsers &&
              users.length === 0 && (
                <p className="p-4 text-sm text-gray-500 text-center">
                  No se encontraron usuarios.
                </p>
              )}

          </div>

          {equipment.user && (
            <button
              type="button"
              onClick={() => setSelectedUserId("")}
              className="mt-4 text-sm text-red-600 hover:text-red-800"
            >
              Desasignar equipo
            </button>
          )}

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 px-6 py-4 border-t">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleAssign}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : selectedUserId
                ? "Asignar"
                : "Desasignar"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AssignEquipmentModal;