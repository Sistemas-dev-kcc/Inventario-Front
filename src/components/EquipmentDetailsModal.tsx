import type { Equipment } from "../types";

interface EquipmentDetailsModalProps {
  isOpen: boolean;
  equipment: Equipment | null;
  onClose: () => void;
  onAssign: () => void;
}

function EquipmentDetailsModal({
  isOpen,
  equipment,
  onClose,
  onAssign
}: EquipmentDetailsModalProps) {

  if (!isOpen || !equipment) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-xl text-white">
              💻
            </div>

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                {equipment.hostname}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Información completa del equipo
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-400 transition hover:text-gray-700"
            aria-label="Cerrar"
          >
            ×
          </button>

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="space-y-8 overflow-y-auto p-6">

          {/* =====================================================
              ESTADO
          ===================================================== */}

          <section>

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  Estado del equipo
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Estado actual dentro del inventario
                </p>

              </div>

              <StatusBadge
                status={equipment.status}
              />

            </div>

          </section>

          {/* =====================================================
              ASIGNACIÓN
          ===================================================== */}

          <section>

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                  Asignación
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Usuario responsable del equipo
                </p>

              </div>

              {equipment.status !== "BAJA" && (
                <button
                  type="button"
                  onClick={onAssign}
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
                >
                  {equipment.user
                    ? "Cambiar usuario"
                    : "Asignar equipo"}
                </button>
              )}

            </div>

            {equipment.user ? (

              <div className="rounded-xl border bg-gray-50 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 font-semibold text-white">
                    {getInitials(equipment.user.name)}
                  </div>

                  <div className="min-w-0">

                    <p className="font-medium text-gray-900">
                      {equipment.user.name}
                    </p>

                    {equipment.user.department && (
                      <p className="mt-1 text-xs text-gray-400">
                        {equipment.user.department}
                      </p>
                    )}

                    {equipment.user.position && (
                      <p className="text-xs text-gray-400">
                        {equipment.user.position}
                      </p>
                    )}

                  </div>

                </div>

              </div>

            ) : (

              <div className="rounded-lg border border-dashed p-6 text-center">

                <p className="text-sm text-gray-500">
                  Este equipo no está asignado a ningún usuario.
                </p>

                {equipment.status !== "BAJA" && (
                  <button
                    type="button"
                    onClick={onAssign}
                    className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
                  >
                    Asignar equipo
                  </button>
                )}

              </div>

            )}

          </section>

          {/* =====================================================
              INFORMACIÓN GENERAL
          ===================================================== */}

          <section>

            <SectionTitle>
              Información general
            </SectionTitle>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

              <Info
                label="Hostname"
                value={equipment.hostname}
              />

              <Info
                label="Número de serie"
                value={equipment.serialNumber}
              />

              <Info
                label="Dirección IP"
                value={equipment.ip}
              />

              <Info
                label="Correo electrónico"
                value={equipment.email}
              />

              <Info
                label="Tipo"
                value={getTypeLabel(equipment.type)}
              />

              <Info
                label="Modelo"
                value={equipment.model}
              />

              <Info
                label="Sistema operativo"
                value={equipment.operatingSystem}
              />

            </div>

          </section>

          {/* =====================================================
              HARDWARE
          ===================================================== */}

          <section>

            <SectionTitle>
              Hardware
            </SectionTitle>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

              <Info
                label="RAM"
                value={equipment.ram}
              />

              <Info
                label="Memoria"
                value={equipment.memory}
              />

              <BooleanInfo
                label="Monitor"
                value={equipment.monitor}
              />

              <BooleanInfo
                label="Back"
                value={equipment.back}
              />

              <BooleanInfo
                label="Antivirus"
                value={equipment.antivirus}
              />

            </div>

          </section>

          {/* =====================================================
              INFORMACIÓN ADICIONAL
          ===================================================== */}

          <section>

            <SectionTitle>
              Información adicional
            </SectionTitle>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

              <Info
                label="TeamViewer"
                value={equipment.teamviewer}
              />

              <Info
                label="Garantía"
                value={formatWarranty(equipment.warranty)}
              />

              <Info
                label="Fecha de registro"
                value={formatDate(equipment.createdAt)}
              />

              <Info
                label="Última actualización"
                value={formatDate(equipment.updatedAt)}
              />

            </div>

          </section>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex justify-end border-t px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2.5 transition hover:bg-gray-50"
          >
            Cerrar
          </button>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
      {children}
    </h3>
  );
}

/* =========================================================
   INFO
========================================================= */

interface InfoProps {
  label: string;
  value?: string | null;
}

function Info({
  label,
  value
}: InfoProps) {

  return (
    <div className="rounded-lg border px-4 py-3">

      <p className="mb-1 text-xs text-gray-500">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-gray-900">
        {value || "No especificado"}
      </p>

    </div>
  );
}

/* =========================================================
   BOOLEAN INFO
========================================================= */

function BooleanInfo({
  label,
  value
}: {
  label: string;
  value: boolean;
}) {

  return (
    <div className="rounded-lg border px-4 py-3">

      <p className="mb-1 text-xs text-gray-500">
        {label}
      </p>

      <div className="flex items-center gap-2">

        <span
          className={`
            h-2
            w-2
            rounded-full
            ${value
              ? "bg-green-500"
              : "bg-gray-300"
            }
          `}
        />

        <p
          className={`
            text-sm
            font-medium
            ${value
              ? "text-green-700"
              : "text-gray-500"
            }
          `}
        >
          {value ? "Sí" : "No"}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status
}: {
  status: string;
}) {

  return (
    <span className={getStatusClass(status)}>
      {getStatusLabel(status)}
    </span>
  );
}

/* =========================================================
   TYPE LABEL
========================================================= */

function getTypeLabel(type: string) {

  const types: Record<string, string> = {
    LAPTOP: "Laptop",
    PC: "PC",
    ALL_IN_ONE: "All in One"
  };

  return types[type] ?? type;
}

/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(status: string) {

  const statuses: Record<string, string> = {
    ACTIVO: "Activo",
    ALMACEN: "Almacén",
    BAJA: "Baja"
  };

  return statuses[status] ?? status;
}

/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status: string) {

  const classes: Record<string, string> = {

    ACTIVO:
      "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700",

    ALMACEN:
      "rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700",

    BAJA:
      "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"

  };

  return (
    classes[status] ??
    "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name: string) {

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

/* =========================================================
   WARRANTY
========================================================= */

function formatWarranty(
  warranty?: string | null
) {

  if (!warranty) {
    return null;
  }

  return formatDate(warranty);
}

/* =========================================================
   DATE
========================================================= */

function formatDate(date?: string | null) {

  if (!date) {
    return "No especificado";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export default EquipmentDetailsModal;