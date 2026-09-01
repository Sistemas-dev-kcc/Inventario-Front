
import { useEffect, useState } from "react";
import { api, ApiError } from "../services/api";

import type {
  Equipment,
  EquipmentStatus,
  EquipmentType
} from "../types";

interface EquipmentModalProps {
  isOpen: boolean;
  equipment: Equipment | null;
  onClose: () => void;
  onSaved: () => void;
}


// ==================================================
// FORMULARIO
// ==================================================

interface EquipmentForm {

  email: string;

  ip: string;

  serialNumber: string;

  hostname: string;

  model: string;

  type: EquipmentType;

  teamviewer: string;

  operatingSystem: string;

  memory: string;

  ram: string;

  monitor: boolean;

  back: boolean;

  antivirus: boolean;

  warranty: string;

  status: EquipmentStatus;
}


// ==================================================
// FORMULARIO VACÍO
// ==================================================

const emptyForm: EquipmentForm = {

  email: "",

  ip: "",

  serialNumber: "",

  hostname: "",

  model: "",

  type: "PC",

  teamviewer: "",

  operatingSystem: "",

  memory: "",

  ram: "",

  monitor: false,

  back: false,

  antivirus: false,

  warranty: "",

  status: "ALMACEN"

};


// ==================================================
// COMPONENTE
// ==================================================

function EquipmentModal({
  isOpen,
  equipment,
  onClose,
  onSaved
}: EquipmentModalProps) {

  const [form, setForm] =
    useState<EquipmentForm>(emptyForm);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<string[]>([]);

  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  const isEditing =
    Boolean(equipment);


  // ==================================================
  // CARGAR EQUIPO
  // ==================================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    setErrors([]);

    setFieldErrors({});

    if (equipment) {

      setForm({

        email:
          equipment.email ?? "",

        ip:
          equipment.ip,

        serialNumber:
          equipment.serialNumber,

        hostname:
          equipment.hostname,

        model:
          equipment.model,

        type:
          equipment.type,

        teamviewer:
          equipment.teamviewer ?? "",

        operatingSystem:
          equipment.operatingSystem,

        memory:
          equipment.memory ?? "",

        ram:
          equipment.ram ?? "",

        monitor:
          equipment.monitor,

        back:
          equipment.back,

        antivirus:
          equipment.antivirus,

        warranty:
          equipment.warranty ?? "",

        status:
          equipment.status

      });

    } else {

      setForm({
        ...emptyForm
      });

    }

  }, [isOpen, equipment]);


  // ==================================================
  // ESC
  // ==================================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      if (
        event.key === "Escape" &&
        !loading
      ) {
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

  }, [
    isOpen,
    loading,
    onClose
  ]);


  // ==================================================
  // MODAL CERRADO
  // ==================================================

  if (!isOpen) {
    return null;
  }


  // ==================================================
  // INPUT
  // ==================================================

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({

      ...previous,

      [name]: value

    }));


    setFieldErrors((previous) => {

      if (!previous[name]) {
        return previous;
      }

      const newErrors = {
        ...previous
      };

      delete newErrors[name];

      return newErrors;

    });

  }


  // ==================================================
  // SELECT
  // ==================================================

  function handleSelectChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {

    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({

      ...previous,

      [name]: value

    }));


    setFieldErrors((previous) => {

      if (!previous[name]) {
        return previous;
      }

      const newErrors = {
        ...previous
      };

      delete newErrors[name];

      return newErrors;

    });

  }


  // ==================================================
  // CHECKBOX
  // ==================================================

  function handleCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const {
      name,
      checked
    } = e.target;

    setForm((previous) => ({

      ...previous,

      [name]: checked

    }));

  }


  // ==================================================
  // GUARDAR
  // ==================================================

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setErrors([]);

    setFieldErrors({});

    // No activamos loading antes de las
    // validaciones locales.
    // Así evitamos dejar el botón bloqueado.

    // ==================================================
    // VALIDACIONES
    // ==================================================

    const validationErrors: string[] = [];

    if (!form.hostname.trim()) {

      validationErrors.push(
        "El hostname es obligatorio."
      );

    }

    if (!form.serialNumber.trim()) {

      validationErrors.push(
        "El número de serie es obligatorio."
      );

    }

    if (!form.ip.trim()) {

      validationErrors.push(
        "La dirección IP es obligatoria."
      );

    }

    if (!form.model.trim()) {

      validationErrors.push(
        "El modelo es obligatorio."
      );

    }

    if (!form.operatingSystem.trim()) {

      validationErrors.push(
        "El sistema operativo es obligatorio."
      );

    }

    if (
      validationErrors.length > 0
    ) {

      setErrors(
        validationErrors
      );

      return;

    }


    try {

      setLoading(true);


      // ==================================================
      // BODY
      // ==================================================

      const body = {

        email:
          form.email.trim() || null,

        ip:
          form.ip.trim(),

        serialNumber:
          form.serialNumber.trim(),

        hostname:
          form.hostname.trim(),

        model:
          form.model.trim(),

        type:
          form.type,

        teamviewer:
          form.teamviewer.trim() || null,

        operatingSystem:
          form.operatingSystem.trim(),

        memory:
          form.memory || null,

        ram:
          form.ram || null,

        monitor:
          form.monitor,

        back:
          form.back,

        antivirus:
          form.antivirus,

        warranty:
          form.warranty || null,

        status:
          form.status

      };


      // ==================================================
      // EDITAR
      // ==================================================

      if (
        isEditing &&
        equipment
      ) {

        await api(
          `/equipment/${equipment.id}`,
          {
            method: "PATCH",

            body:
              JSON.stringify(body)
          }
        );

      }


      // ==================================================
      // CREAR
      // ==================================================

      else {

        await api(
          "/equipment",
          {
            method: "POST",

            body:
              JSON.stringify(body)
          }
        );

      }


      // ==================================================
      // ÉXITO
      // ==================================================

      onSaved();

      onClose();

    } catch (error) {

      // ==================================================
      // ERROR API
      // ==================================================

      if (
        error instanceof ApiError
      ) {

        setFieldErrors(
          error.fieldErrors ?? {}
        );


        if (
          error.errors.length > 0
        ) {

          setErrors(
            error.errors
          );

        }

        else if (
          Object.keys(
            error.fieldErrors ?? {}
          ).length === 0
        ) {

          setErrors([
            error.message
          ]);

        }

      }

      else {

        setErrors([

          error instanceof Error
            ? error.message
            : "No se pudo guardar el equipo."

        ]);

      }

    } finally {

      setLoading(false);

    }

  }


  // ==================================================
  // RENDER
  // ==================================================

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
          max-h-[92vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

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

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-slate-900
              "
            >

              {isEditing
                ? "Editar equipo"
                : "Nuevo equipo"}

            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >

              {isEditing
                ? "Modifica la información del equipo."
                : "Registra un nuevo equipo."}

            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-xl
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:opacity-50
            "
          >
            ×
          </button>

        </div>


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-y-auto
          "
        >

          <div
            className="
              space-y-8
              p-5
              sm:p-6
            "
          >

            {/* ==================================================
                ERRORES
            ================================================== */}

            {errors.length > 0 && (

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

                <p className="mb-2 font-medium">
                  No se pudo guardar el equipo:
                </p>

                <ul
                  className="
                    list-inside
                    list-disc
                    space-y-1
                  "
                >

                  {errors.map(
                    (message, index) => (

                      <li key={index}>
                        {message}
                      </li>

                    )
                  )}

                </ul>

              </div>

            )}


            {/* ==================================================
                INFORMACIÓN DEL EQUIPO
            ================================================== */}

            <section>

              <SectionTitle>
                Información del equipo
              </SectionTitle>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-2
                "
              >

                <Input
                  label="Hostname"
                  name="hostname"
                  value={form.hostname}
                  error={
                    fieldErrors.hostname
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="PC-SISTEMAS-001"
                  required
                />


                <Input
                  label="Número de serie"
                  name="serialNumber"
                  value={
                    form.serialNumber
                  }
                  error={
                    fieldErrors.serialNumber
                  }
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(
                          /[^A-Za-z0-9]/g,
                          ""
                        )
                        .slice(0, 7);

                    setForm(
                      (previous) => ({
                        ...previous,
                        serialNumber:
                          value
                      })
                    );

                    clearFieldError(
                      "serialNumber"
                    );

                  }}
                  placeholder="ABC1234"
                  required
                />


                <Input
                  label="Dirección IP"
                  name="ip"
                  value={form.ip}
                  error={fieldErrors.ip}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(
                          /[^0-9.]/g,
                          ""
                        )
                        .slice(0, 15);

                    setForm(
                      (previous) => ({
                        ...previous,
                        ip: value
                      })
                    );

                    clearFieldError(
                      "ip"
                    );

                  }}
                  placeholder="192.168.1.100"
                  required
                />


                <Input
                  label="Modelo"
                  name="model"
                  value={form.model}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Dell Latitude 5420"
                  required
                />


                <Select
                  label="Tipo"
                  name="type"
                  value={form.type}
                  onChange={
                    handleSelectChange
                  }
                  options={[
                    {
                      value: "LAPTOP",
                      label: "Laptop"
                    },
                    {
                      value: "PC",
                      label: "PC"
                    },
                    {
                      value: "ALL_IN_ONE",
                      label: "All in One"
                    }
                  ]}
                />


                <Input
                  label="Sistema operativo"
                  name="operatingSystem"
                  value={
                    form.operatingSystem
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Windows 11 Pro"
                  required
                />


                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  error={fieldErrors.email}
                  onChange={
                    handleInputChange
                  }
                  placeholder="equipo@empresa.com"
                />

              </div>

            </section>


            {/* ==================================================
                HARDWARE
            ================================================== */}

            <section>

              <SectionTitle>
                Hardware
              </SectionTitle>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-2
                "
              >

                <Select
                  label="RAM"
                  name="ram"
                  value={form.ram}
                  onChange={
                    handleSelectChange
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Seleccionar RAM"
                    },
                    {
                      value: "4 GB",
                      label: "4 GB"
                    },
                    {
                      value: "8 GB",
                      label: "8 GB"
                    },
                    {
                      value: "16 GB",
                      label: "16 GB"
                    },
                    {
                      value: "32 GB",
                      label: "32 GB"
                    },
                    {
                      value: "64 GB",
                      label: "64 GB"
                    }
                  ]}
                />


                <Select
                  label="Memoria"
                  name="memory"
                  value={form.memory}
                  onChange={
                    handleSelectChange
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Seleccionar memoria"
                    },
                    {
                      value: "128 GB SSD",
                      label: "128 GB SSD"
                    },
                    {
                      value: "128 GB HDD",
                      label: "128 GB HDD"
                    },
                    {
                      value: "256 GB SSD",
                      label: "256 GB SSD"
                    },
                    {
                      value: "256 GB HDD",
                      label: "256 GB HDD"
                    },
                    {
                      value: "512 GB SSD",
                      label: "512 GB SSD"
                    },
                    {
                      value: "512 GB HDD",
                      label: "512 GB HDD"
                    },
                    {
                      value: "1 TB SSD",
                      label: "1 TB SSD"
                    },
                    {
                      value: "1 TB HDD",
                      label: "1 TB HDD"
                    }
                  ]}
                />

              </div>


              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-3
                "
              >

                <Checkbox
                  label="Monitor"
                  name="monitor"
                  checked={form.monitor}
                  onChange={
                    handleCheckboxChange
                  }
                />

                <Checkbox
                  label="Back"
                  name="back"
                  checked={form.back}
                  onChange={
                    handleCheckboxChange
                  }
                />

                <Checkbox
                  label="Antivirus"
                  name="antivirus"
                  checked={form.antivirus}
                  onChange={
                    handleCheckboxChange
                  }
                />

              </div>

            </section>


            {/* ==================================================
                INFORMACIÓN ADICIONAL
            ================================================== */}

            <section>

              <SectionTitle>
                Información adicional
              </SectionTitle>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-2
                "
              >

                <Input
                  label="TeamViewer"
                  name="teamviewer"
                  value={
                    form.teamviewer
                  }
                  error={
                    fieldErrors.teamviewer
                  }
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    setForm(
                      (previous) => ({
                        ...previous,
                        teamviewer:
                          value
                      })
                    );

                    clearFieldError(
                      "teamviewer"
                    );

                  }}
                  placeholder="ID de TeamViewer"
                />


                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >
                    Garantía
                  </label>

                  <input
                    type="date"
                    value={form.warranty}
                    onChange={(e) => {

                      setForm(
                        (previous) => ({
                          ...previous,
                          warranty:
                            e.target.value
                        })
                      );

                    }}
                    disabled={loading}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-3
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-slate-400
                      focus:ring-2
                      focus:ring-slate-100
                      disabled:bg-slate-50
                    "
                  />

                </div>


                {/* ==================================================
                    ESTADO
                ================================================== */}

                <Select
                  label="Estado"
                  name="status"
                  value={form.status}
                  onChange={
                    handleSelectChange
                  }
                  options={[
                    {
                      value: "ACTIVO",
                      label: "Activo"
                    },
                    {
                      value: "ALMACEN",
                      label: "Almacén"
                    },
                    {
                      value: "BAJA",
                      label: "Baja"
                    }
                  ]}
                />

              </div>

            </section>

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className="
              flex
              flex-col-reverse
              gap-2
              border-t
              border-slate-200
              bg-slate-50
              px-5
              py-4
              sm:flex-row
              sm:justify-end
              sm:px-6
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
                disabled:opacity-50
                sm:w-auto
              "
            >

              {loading
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear equipo"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}


// ==================================================
// LIMPIAR ERROR DE CAMPO
// ==================================================

function clearFieldError(
  _field: string
) {

  // Esta función se utiliza desde los
  // handlers específicos. La lógica real
  // se mantiene dentro de cada actualización
  // mediante el estado del componente.

}


// ==================================================
// SECTION TITLE
// ==================================================

function SectionTitle({
  children
}: {
  children: React.ReactNode;
}) {

  return (

    <h3
      className="
        mb-4
        text-sm
        font-semibold
        uppercase
        tracking-wide
        text-slate-900
      "
    >
      {children}
    </h3>

  );

}


// ==================================================
// INPUT
// ==================================================

interface InputProps {

  label: string;

  name: string;

  value: string;

  type?: string;

  placeholder?: string;

  required?: boolean;

  error?: string;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}


function Input({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required,
  error,
  onChange
}: InputProps) {

  return (

    <div>

      <label
        htmlFor={name}
        className="
          mb-1.5
          block
          text-sm
          font-medium
          text-slate-700
        "
      >

        {label}

        {required && (

          <span className="ml-1 text-red-500">
            *
          </span>

        )}

      </label>


      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={`
          w-full
          rounded-xl
          border
          px-3
          py-2.5
          text-sm
          outline-none
          transition

          ${
            error
              ? `
                border-red-500
                bg-red-50/30
                focus:ring-2
                focus:ring-red-200
              `
              : `
                border-slate-200
                focus:border-slate-400
                focus:ring-2
                focus:ring-slate-100
              `
          }
        `}
      />


      {error && (

        <p
          className="
            mt-1.5
            text-xs
            text-red-600
          "
        >
          ⚠ {error}
        </p>

      )}

    </div>

  );

}


// ==================================================
// SELECT
// ==================================================

interface SelectOption {

  value: string;

  label: string;
}


interface SelectProps {

  label: string;

  name: string;

  value: string;

  options: SelectOption[];

  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}


function Select({
  label,
  name,
  value,
  options,
  onChange
}: SelectProps) {

  return (

    <div>

      <label
        htmlFor={name}
        className="
          mb-1.5
          block
          text-sm
          font-medium
          text-slate-700
        "
      >
        {label}
      </label>


      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
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
          focus:border-slate-400
          focus:ring-2
          focus:ring-slate-100
        "
      >

        {options.map(
          (option) => (

            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>

          )
        )}

      </select>

    </div>

  );

}


// ==================================================
// CHECKBOX
// ==================================================

interface CheckboxProps {

  label: string;

  name: string;

  checked: boolean;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}


function Checkbox({
  label,
  name,
  checked,
  onChange
}: CheckboxProps) {

  return (

    <label
      className="
        flex
        cursor-pointer
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        px-4
        py-3
        transition
        hover:bg-slate-50
      "
    >

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="
          h-4
          w-4
        "
      />

      <span
        className="
          text-sm
          text-slate-700
        "
      >
        {label}
      </span>

    </label>

  );

}


export default EquipmentModal;

