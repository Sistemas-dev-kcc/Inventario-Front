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
  department: string;
  position: string;
  boss: string;
}

const departments = [
  "AyB",
  "Contabilidad",
  "Division Cuartos",
  "E Commerce",
  "Gerencia",
  "Mantenimiento",
  "Nominas",
  "Recepcion",
  "Recursos Humanos",
  "Sistemas",
  "Telefonos",
  "Tiempo Compartido",
  "Ventas"
];

const emptyForm: UserForm = {
  name: "",
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


  // ==========================================
  // CARGAR DATOS DEL USUARIO
  // ==========================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    setError("");

    if (user) {

      setForm({
        name: user.name,
        department: user.department ?? "",
        position: user.position ?? "",
        boss: user.boss ?? ""
      });

    } else {

      setForm(emptyForm);

    }

  }, [isOpen, user]);


  // ==========================================
  // CERRAR CON ESC
  // ==========================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {

      if (event.key === "Escape" && !loading) {
        onClose();
      }

    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [isOpen, loading, onClose]);


  // ==========================================
  // SI ESTÁ CERRADO
  // ==========================================

  if (!isOpen) {
    return null;
  }


  // ==========================================
  // CAMBIAR INPUT
  // ==========================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {

    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

  }


  // ==========================================
  // GUARDAR
  // ==========================================

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");


    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (!form.name.trim()) {

      setError(
        "El nombre es obligatorio."
      );

      return;
    }

    if (!form.department) {

      setError(
        "El departamento es obligatorio."
      );

      return;
    }


    try {

      setLoading(true);


      const body = {
        name: form.name.trim(),
        department: form.department,
        position:
          form.position.trim() || null,
        boss:
          form.boss.trim() || null
      };


      // ==========================================
      // EDITAR
      // ==========================================

      if (isEditing && user) {

        await api(
          `/users/${user.id}`,
          {
            method: "PATCH",

            body: JSON.stringify(body)
          }
        );

      }


      // ==========================================
      // CREAR
      // ==========================================

      else {

        await api(
          "/users",
          {
            method: "POST",

            body: JSON.stringify(body)
          }
        );

      }


      // ==========================================
      // FINALIZAR
      // ==========================================

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


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        sm:p-6
      "
      onMouseDown={(e) => {

        if (
          e.target === e.currentTarget &&
          !loading
        ) {
          onClose();
        }

      }}
    >

      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-lg
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            px-5
            py-4
            sm:px-6
          "
        >

          <div className="min-w-0">

            <h2
              className="
                text-lg
                font-semibold
                text-slate-900
              "
            >
              {isEditing
                ? "Editar usuario"
                : "Nuevo usuario"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {isEditing
                ? "Modifica la información del usuario."
                : "Registra un nuevo usuario."}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar"
            className="
              ml-4
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-xl
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            ×
          </button>

        </div>


        {/* ==========================================
            BODY
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-y-auto
            p-5
            sm:p-6
          "
        >

          <div className="space-y-4">

            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>

            )}


            {/* ======================================
                NOMBRE
            ====================================== */}

            <div>

              <label
                htmlFor="name"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Nombre
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                autoComplete="name"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-100
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />

            </div>


            {/* ======================================
                DEPARTAMENTO
            ====================================== */}

            <div>

              <label
                htmlFor="department"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Departamento
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <div className="relative">

                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  disabled={loading}
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    pr-10
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-slate-400
                    focus:ring-2
                    focus:ring-slate-100
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                  "
                >

                  <option value="">
                    Selecciona un departamento
                  </option>

                  {departments.map(
                    (department) => (

                      <option
                        key={department}
                        value={department}
                      >
                        {department}
                      </option>

                    )
                  )}

                </select>


                {/* FLECHA */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
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
                      d="m6 9 6 6 6-6"
                    />

                  </svg>

                </div>

              </div>

            </div>


            {/* ======================================
                PUESTO
            ====================================== */}

            <div>

              <label
                htmlFor="position"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Puesto
              </label>

              <input
                id="position"
                name="position"
                type="text"
                value={form.position}
                onChange={handleChange}
                placeholder="Soporte técnico"
                autoComplete="organization-title"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-100
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />

            </div>


            {/* ======================================
                JEFE
            ====================================== */}

            <div>

              <label
                htmlFor="boss"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Jefe
              </label>

              <input
                id="boss"
                name="boss"
                type="text"
                value={form.boss}
                onChange={handleChange}
                placeholder="Nombre del jefe"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-100
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />

            </div>

          </div>


          {/* ==========================================
              FOOTER
          ========================================== */}

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-2
              border-t
              border-slate-200
              pt-4
              sm:flex-row
              sm:justify-end
              sm:gap-3
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
              "
            >
              Cancelar
            </button>


            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-slate-900
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
              "
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

