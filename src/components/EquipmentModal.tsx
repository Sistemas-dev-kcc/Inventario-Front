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

interface EquipmentForm {
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

const emptyForm: EquipmentForm = {
  ip: "",
  serialNumber: "",
  hostname: "",
  model: "",
  type: "LAPTOP",
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

  // Errores generales
  const [errors, setErrors] =
    useState<string[]>([]);

  // Errores específicos de cada campo
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  const isEditing = Boolean(equipment);

  // ==================================================
  // CARGAR DATOS DEL EQUIPO
  // ==================================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    // Limpiar errores al abrir el modal
    setErrors([]);
    setFieldErrors({});

    if (equipment) {

      setForm({
        ip: equipment.ip,
        serialNumber: equipment.serialNumber,
        hostname: equipment.hostname,
        model: equipment.model,
        type: equipment.type,
        teamviewer: equipment.teamviewer ?? "",
        operatingSystem: equipment.operatingSystem,
        memory: equipment.memory ?? "",
        ram: equipment.ram ?? "",
        monitor: equipment.monitor,
        back: equipment.back,
        antivirus: equipment.antivirus,
        warranty: equipment.warranty ?? "",
        status: equipment.status
      });

    } else {

      setForm(emptyForm);

    }

  }, [isOpen, equipment]);

  // ==================================================
  // SI EL MODAL ESTÁ CERRADO
  // ==================================================

  if (!isOpen) {
    return null;
  }

  // ==================================================
  // INPUTS
  // ==================================================

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    // Si el usuario modifica un campo que tenía error,
    // quitamos visualmente ese error.
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
  // SELECTS
  // ==================================================

  function handleSelectChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

  }

  // ==================================================
  // CHECKBOX
  // ==================================================

  function handleCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const { name, checked } = e.target;

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
    setLoading(true);

    try {

      // ==================================================
      // VALIDACIONES LOCALES
      // ==================================================

      if (!form.hostname.trim()) {

        setErrors([
          "El hostname es obligatorio."
        ]);

        return;
      }

      if (!form.serialNumber.trim()) {

        setErrors([
          "El número de serie es obligatorio."
        ]);

        return;
      }

      if (!form.ip.trim()) {

        setErrors([
          "La dirección IP es obligatoria."
        ]);

        return;
      }

      if (!form.model.trim()) {

        setErrors([
          "El modelo es obligatorio."
        ]);

        return;
      }

      if (!form.operatingSystem.trim()) {

        setErrors([
          "El sistema operativo es obligatorio."
        ]);

        return;
      }

      // ==================================================
      // DATOS PARA EL BACKEND
      // ==================================================

      const body = {
        ip: form.ip,
        serialNumber: form.serialNumber,
        hostname: form.hostname,
        model: form.model,
        type: form.type,
        teamviewer: form.teamviewer || undefined,
        operatingSystem: form.operatingSystem,
        memory: form.memory || undefined,
        ram: form.ram || undefined,
        monitor: form.monitor,
        back: form.back,
        antivirus: form.antivirus,
        warranty: form.warranty || undefined,
        status: form.status
      };

      // ==================================================
      // EDITAR
      // ==================================================

      if (isEditing && equipment) {

        await api(`/equipment/${equipment.id}`, {
          method: "PATCH",
          body: JSON.stringify(body)
        });

      }

      // ==================================================
      // CREAR
      // ==================================================

      else {

        await api("/equipment", {
          method: "POST",
          body: JSON.stringify(body)
        });

      }

      // ==================================================
      // ÉXITO
      // ==================================================

      onSaved();
      onClose();

    } catch (error) {

      // ==================================================
      // ERROR DE LA API
      // ==================================================

      if (error instanceof ApiError) {

        // Errores específicos de campos
        setFieldErrors(
          error.fieldErrors ?? {}
        );

        // Errores generales
        if (error.errors.length > 0) {

          setErrors(error.errors);

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

      // ==================================================
      // ERROR DESCONOCIDO
      // ==================================================

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
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onMouseDown={(e) => {

        if (
          e.target === e.currentTarget &&
          !loading
        ) {
          onClose();
        }

      }}
    >

      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-xl flex flex-col">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between px-6 py-4 border-b">

          <div>

            <h2 className="text-lg font-semibold">

              {isEditing
                ? "Editar equipo"
                : "Nuevo equipo"}

            </h2>

            <p className="text-sm text-gray-500 mt-1">

              {isEditing
                ? "Modifica la información del equipo."
                : "Registra un nuevo equipo."}

            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 text-xl disabled:opacity-50"
          >
            ×
          </button>

        </div>

        {/* ==================================================
            FORMULARIO
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >

          <div className="p-6 space-y-8">

            {/* ==================================================
                ERRORES GENERALES
            ================================================== */}

            {errors.length > 0 && (

              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">

                <p className="font-medium mb-2">
                  No se pudo guardar el equipo:
                </p>

                <ul className="list-disc list-inside space-y-1">

                  {errors.map((message, index) => (

                    <li key={index}>
                      {message}
                    </li>

                  ))}

                </ul>

              </div>

            )}

            {/* ==================================================
                INFORMACIÓN DEL EQUIPO
            ================================================== */}

            <section>

              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Información del equipo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* HOSTNAME */}

                <Input
                  label="Hostname"
                  name="hostname"
                  value={form.hostname}
                  error={fieldErrors.hostname}
                  onChange={handleInputChange}
                  placeholder="PC-SISTEMAS-001"
                  required
                />

                {/* SERIAL */}

                <Input
                  label="Número de serie"
                  name="serialNumber"
                  value={form.serialNumber}
                  error={fieldErrors.serialNumber}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/[^A-Za-z0-9]/g, "")
                        .slice(0, 7);

                    setForm((previous) => ({
                      ...previous,
                      serialNumber: value
                    }));

                    setFieldErrors((previous) => {

                      if (!previous.serialNumber) {
                        return previous;
                      }

                      const newErrors = {
                        ...previous
                      };

                      delete newErrors.serialNumber;

                      return newErrors;
                    });

                  }}
                  placeholder="ABC1234"
                  required
                />

                {/* IP */}

                <Input
                  label="Dirección IP"
                  name="ip"
                  value={form.ip}
                  error={fieldErrors.ip}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/[^0-9.]/g, "")
                        .slice(0, 15);

                    setForm((previous) => ({
                      ...previous,
                      ip: value
                    }));

                    setFieldErrors((previous) => {

                      if (!previous.ip) {
                        return previous;
                      }

                      const newErrors = {
                        ...previous
                      };

                      delete newErrors.ip;

                      return newErrors;
                    });

                  }}
                  placeholder="192.168.1.100"
                  required
                />

                {/* MODELO */}

                <Input
                  label="Modelo"
                  name="model"
                  value={form.model}
                  onChange={handleInputChange}
                  placeholder="Dell Latitude 5420"
                  required
                />

                {/* TIPO */}

                <Select
                  label="Tipo"
                  name="type"
                  value={form.type}
                  onChange={handleSelectChange}
                  options={[
                    {
                      value: "LAPTOP",
                      label: "Laptop"
                    },
                    {
                      value: "PC",
                      label: "Pc"
                    },
                    {
                      value: "ALL_IN_ONE",
                      label: "All in one"
                    }
                  ]}
                />

                {/* SISTEMA OPERATIVO */}

                <Input
                  label="Sistema operativo"
                  name="operatingSystem"
                  value={form.operatingSystem}
                  onChange={handleInputChange}
                  placeholder="Windows 11 Pro"
                  required
                />

              </div>

            </section>

            {/* ==================================================
                HARDWARE
            ================================================== */}

            <section>

              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Hardware
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* RAM */}

                <Select
                  label="RAM"
                  name="ram"
                  value={form.ram}
                  onChange={handleSelectChange}
                  options={[
                    {
                      value: "",
                      label: "Seleccionar RAM"
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

                {/* MEMORIA */}

                <Select
                  label="Memoria"
                  name="memory"
                  value={form.memory}
                  onChange={handleSelectChange}
                  options={[
                    {
                      value: "",
                      label: "Seleccionar memoria"
                    },
                    {
                      value: "500 GB SSD",
                      label: "500 GB SSD"
                    },
                    {
                      value: "500 GB HDD",
                      label: "500 GB HDD"
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

              {/* CHECKBOXES */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

                <Checkbox
                  label="Monitor"
                  name="monitor"
                  checked={form.monitor}
                  onChange={handleCheckboxChange}
                />

                <Checkbox
                  label="Back"
                  name="back"
                  checked={form.back}
                  onChange={handleCheckboxChange}
                />

                <Checkbox
                  label="Antivirus"
                  name="antivirus"
                  checked={form.antivirus}
                  onChange={handleCheckboxChange}
                />

              </div>

            </section>

            {/* ==================================================
                INFORMACIÓN ADICIONAL
            ================================================== */}

            <section>

              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Información adicional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* TEAMVIEWER */}

                <Input
                  label="TeamViewer"
                  name="teamviewer"
                  value={form.teamviewer}
                  error={fieldErrors.teamviewer}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    setForm((previous) => ({
                      ...previous,
                      teamviewer: value
                    }));

                    setFieldErrors((previous) => {

                      if (!previous.teamviewer) {
                        return previous;
                      }

                      const newErrors = {
                        ...previous
                      };

                      delete newErrors.teamviewer;

                      return newErrors;
                    });

                  }}
                  placeholder="ID de TeamViewer"
                />

                {/* GARANTÍA */}

                <div>

                  <label className="block text-sm font-medium mb-1">
                    Garantía
                  </label>

                  <input
                    type="date"
                    value={form.warranty}
                    onChange={(e) => {

                      setForm((previous) => ({
                        ...previous,
                        warranty: e.target.value
                      }));

                    }}
                    className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-300"
                  />

                </div>

                {/* ESTADO */}

                <Select
                  label="Estado"
                  name="status"
                  value={form.status}
                  onChange={handleSelectChange}
                  options={[
                    {
                      value: "ACTIVO",
                      label: "Activo"
                    },
                    {
                      value: "ALMACEN",
                      label: "Almacén"
                    },
                  ]}
                />

              </div>

            </section>

          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
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
                  : "Crear equipo"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

// ==================================================
// INPUT
// ==================================================

interface InputProps {
  label: string;
  name: string;
  value: string;
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
  placeholder,
  required,
  error,
  onChange
}: InputProps) {

  return (

    <div>

      <label className="block text-sm font-medium mb-1">

        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}

      </label>

      <input
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={`
          w-full
          px-3
          py-2.5
          rounded-lg
          outline-none
          border
          transition

          ${error
            ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:ring-2 focus:ring-slate-300"
          }
        `}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
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

      <label className="block text-sm font-medium mb-1">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-slate-300"
      >

        {options.map((option) => (

          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>

        ))}

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

    <label className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50">

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4"
      />

      <span className="text-sm">
        {label}
      </span>

    </label>

  );
}

export default EquipmentModal;