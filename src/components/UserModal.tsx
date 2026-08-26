import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { User } from "../types";

interface UserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSaved: () => void;
}

interface UserForm {
  name: string;
  email: string;
  department: string;
  position: string;
  boss: string;
}

const emptyForm: UserForm = {
  name: "",
  email: "",
  department: "",
  position: "",
  boss: ""
};

function UserModal({
  isOpen,
  user,
  onClose,
  onSaved
}: UserModalProps) {

  const [form, setForm] =
    useState<UserForm>(emptyForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const isEditing = Boolean(user);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setError("");

    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        department: user.department ?? "",
        position: user.position ?? "",
        boss: user.boss ?? ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!form.name.trim()) {
        setError("El nombre es obligatorio.");
        return;
      }

      if (!form.email.trim()) {
        setError("El email es obligatorio.");
        return;
      }

      if (isEditing && user) {

        await api(`/users/${user.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            department:
              form.department || undefined,
            position:
              form.position || undefined,
            boss:
              form.boss || undefined
          })
        });

      } else {

        await api("/users", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            department:
              form.department || undefined,
            position:
              form.position || undefined,
            boss:
              form.boss || undefined
          })
        });

      }

      onSaved();
      onClose();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar el usuario."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-4 border-b">

          <div>
            <h2 className="text-lg font-semibold">
              {isEditing
                ? "Editar usuario"
                : "Nuevo usuario"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {isEditing
                ? "Modifica la información del usuario."
                : "Registra un nuevo usuario."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@empresa.com"
              className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Departamento
            </label>

            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Sistemas"
              className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Puesto
            </label>

            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Soporte técnico"
              className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Jefe
            </label>

            <input
              name="boss"
              value={form.boss}
              onChange={handleChange}
              placeholder="Nombre del jefe"
              className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* FOOTER */}

          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear usuario"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UserModal;