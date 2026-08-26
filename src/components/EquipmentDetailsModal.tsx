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
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-xl flex flex-col">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-4 border-b">

          <div>
            <h2 className="text-lg font-semibold">
              Información del equipo
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {equipment.hostname}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>

        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-6 space-y-8">

          {/* ESTADO */}

          <section>

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-sm font-semibold uppercase tracking-wide">
                Estado
              </h3>

              <span className={getStatusClass(equipment.status)}>
                {getStatusLabel(equipment.status)}
              </span>

            </div>

          </section>

          {/* ASIGNACIÓN */}

          <section>

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-sm font-semibold uppercase tracking-wide">
                Asignación
              </h3>

              <button
                onClick={onAssign}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {equipment.user
                  ? "Cambiar usuario"
                  : "Asignar equipo"}
              </button>

            </div>

            {equipment.user ? (

              <div className="border rounded-lg p-4 bg-gray-50">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
                    {getInitials(equipment.user.name)}
                  </div>

                  <div>

                    <p className="font-medium">
                      {equipment.user.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {equipment.user.email}
                    </p>

                    {equipment.user.department && (
                      <p className="text-xs text-gray-400 mt-1">
                        {equipment.user.department}
                      </p>
                    )}

                  </div>

                </div>

              </div>

            ) : (

              <div className="border border-dashed rounded-lg p-5 text-center">

                <p className="text-gray-500">
                  Este equipo no está asignado a ningún usuario.
                </p>

                <button
                  onClick={onAssign}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Asignar equipo
                </button>

              </div>

            )}

          </section>

          {/* INFORMACIÓN GENERAL */}

          <section>

            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Información general
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

          {/* HARDWARE */}

          <section>

            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Hardware
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

          {/* INFORMACIÓN ADICIONAL */}

          <section>

            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Información adicional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Info
                label="TeamViewer"
                value={equipment.teamviewer}
              />

              <Info
                label="Garantía"
                value={equipment.warranty}
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

        {/* FOOTER */}

        <div className="flex justify-end px-6 py-4 border-t">

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border hover:bg-gray-50"
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="border rounded-lg px-4 py-3">

      <p className="text-xs text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-sm font-medium">
        {value || "No especificado"}
      </p>

    </div>
  );
}

function BooleanInfo({
  label,
  value
}: {
  label: string;
  value: boolean;
}) {
  return (
    <div className="border rounded-lg px-4 py-3">

      <p className="text-xs text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-sm font-medium">
        {value ? "Sí" : "No"}
      </p>

    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getTypeLabel(type: string) {
  switch (type) {
    case "LAPTOP":
      return "Laptop";

    case "DESKTOP":
      return "Desktop";

    case "MONITOR":
      return "Monitor";

    case "PRINTER":
      return "Impresora";

    case "OTHER":
      return "Otro";

    default:
      return type;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVO":
      return "Activo";

    case "DISPONIBLE":
      return "Disponible";

    case "MANTENIMIENTO":
      return "Mantenimiento";

    case "ALMACEN":
      return "Almacén";

    case "BAJA":
      return "Baja";

    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "ACTIVO":
      return "px-3 py-1 rounded-full text-xs bg-green-100 text-green-700";

    case "DISPONIBLE":
      return "px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700";

    case "MANTENIMIENTO":
      return "px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700";

    case "ALMACEN":
      return "px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700";

    case "BAJA":
      return "px-3 py-1 rounded-full text-xs bg-red-100 text-red-700";

    default:
      return "px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export default EquipmentDetailsModal;