import type { User } from "../types";

interface UserDetailsModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
}

function UserDetailsModal({
    isOpen,
    user,
    onClose,
}: UserDetailsModalProps) {

    if (!isOpen || !user) {
        return null;
    }

    const equipment = user.equipment ?? [];

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

                <ModalHeader
                    name={user.name}
                    onClose={onClose}
                />

                <div className="space-y-8 overflow-y-auto p-6">

                    <UserInformation user={user} />

                    <AssignedEquipment equipment={equipment} />

                </div>

                <ModalFooter onClose={onClose} />

            </div>
        </div>
    );
}

/* =========================================================
   HEADER
========================================================= */

interface ModalHeaderProps {
    name: string;
    onClose: () => void;
}

function ModalHeader({
    name,
    onClose,
}: ModalHeaderProps) {

    return (
        <div className="flex items-center justify-between border-b px-6 py-4">

            <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 font-semibold text-white">
                    {getInitials(name)}
                </div>

                <div>

                    <h2 className="text-lg font-semibold text-gray-900">
                        {name}
                    </h2>

                    <p className="text-sm text-gray-500">
                        Información del usuario
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
    );
}

/* =========================================================
   INFORMACIÓN DEL USUARIO
========================================================= */

interface UserInformationProps {
    user: User;
}

function UserInformation({
    user,
}: UserInformationProps) {

    return (
        <section>

            <SectionTitle>
                Información personal
            </SectionTitle>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <Info
                    label="Nombre"
                    value={user.name}
                />

                <Info
                    label="Correo electrónico"
                    value={user.email}
                />

                <Info
                    label="Departamento"
                    value={user.department}
                />

                <Info
                    label="Puesto"
                    value={user.position}
                />

                <Info
                    label="Jefe"
                    value={user.boss}
                />

                <Info
                    label="Estado"
                    value={user.active ? "Activo" : "Inactivo"}
                    valueClassName={
                        user.active
                            ? "text-green-700"
                            : "text-red-700"
                    }
                />

            </div>

        </section>
    );
}

/* =========================================================
   EQUIPOS ASIGNADOS
========================================================= */

interface AssignedEquipmentProps {
    equipment: NonNullable<User["equipment"]>;
}

function AssignedEquipment({
    equipment,
}: AssignedEquipmentProps) {

    return (
        <section>

            <div className="mb-4">

                <SectionTitle>
                    Equipos asignados
                </SectionTitle>

                <p className="mt-1 text-sm text-gray-500">
                    {getEquipmentCountText(equipment.length)}
                </p>

            </div>

            {equipment.length === 0 ? (
                <EmptyEquipment />
            ) : (
                <div className="space-y-4">

                    {equipment.map((item) => (
                        <EquipmentCard
                            key={item.id}
                            equipment={item}
                        />
                    ))}

                </div>
            )}

        </section>
    );
}

/* =========================================================
   TARJETA DEL EQUIPO
========================================================= */

interface EquipmentCardProps {
    equipment: NonNullable<User["equipment"]>[number];
}

function EquipmentCard({
    equipment,
}: EquipmentCardProps) {

    return (
        <div className="rounded-xl border p-5 transition hover:bg-gray-50">

            {/* ENCABEZADO */}

            <div className="mb-5 flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <h4 className="truncate font-semibold text-gray-900">
                        {equipment.hostname}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                        Serial: {equipment.serialNumber}
                    </p>

                </div>

                <StatusBadge status={equipment.status} />

            </div>

            {/* INFORMACIÓN */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <EquipmentInfo
                    label="Tipo"
                    value={getTypeLabel(equipment.type)}
                />

                <EquipmentInfo
                    label="Modelo"
                    value={equipment.model}
                />

                <EquipmentInfo
                    label="RAM"
                    value={equipment.ram}
                />

                <EquipmentInfo
                    label="Disco duro"
                    value={equipment.memory}
                />

                <EquipmentInfo
                    label="TeamViewer"
                    value={equipment.teamviewer}
                />

                <EquipmentInfo
                    label="Garantía"
                    value={equipment.warranty}
                />

            </div>

        </div>
    );
}

/* =========================================================
   EQUIPMENT INFO
========================================================= */

interface EquipmentInfoProps {
    label: string;
    value?: string | null;
}

function EquipmentInfo({
    label,
    value,
}: EquipmentInfoProps) {

    return (
        <div className="rounded-lg bg-gray-50 px-3 py-2.5">

            <p className="mb-1 text-xs text-gray-500">
                {label}
            </p>

            <p className="text-sm font-medium text-gray-900">
                {value || "No especificado"}
            </p>

        </div>
    );
}

/* =========================================================
   INFO GENERAL
========================================================= */

interface InfoProps {
    label: string;
    value?: string | null;
    valueClassName?: string;
}

function Info({
    label,
    value,
    valueClassName = "text-gray-900",
}: InfoProps) {

    return (
        <div className="rounded-lg border px-4 py-3">

            <p className="mb-1 text-xs text-gray-500">
                {label}
            </p>

            <p className={`text-sm font-medium ${valueClassName}`}>
                {value || "No especificado"}
            </p>

        </div>
    );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
    status,
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
   SECTION TITLE
========================================================= */

function SectionTitle({
    children,
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
   EMPTY STATE
========================================================= */

function EmptyEquipment() {

    return (
        <div className="rounded-lg border border-dashed p-8 text-center">

            <p className="text-sm text-gray-500">
                Este usuario no tiene equipos asignados.
            </p>

        </div>
    );
}

/* =========================================================
   FOOTER
========================================================= */

function ModalFooter({
    onClose,
}: {
    onClose: () => void;
}) {

    return (
        <div className="flex justify-end border-t px-6 py-4">

            <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2.5 transition hover:bg-gray-50"
            >
                Cerrar
            </button>

        </div>
    );
}

/* =========================================================
   HELPERS
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

function getEquipmentCountText(count: number) {

    if (count === 0) {
        return "No tiene equipos asignados";
    }

    return `${count} equipo${count === 1 ? "" : "s"} asignado${count === 1 ? "" : "s"}`;
}

function getTypeLabel(type: string) {

    const types: Record<string, string> = {
        LAPTOP: "Laptop",
        DESKTOP: "Desktop",
        MONITOR: "Monitor",
        PRINTER: "Impresora",
        OTHER: "Otro",
    };

    return types[type] ?? type;
}

function getStatusLabel(status: string) {

    const statuses: Record<string, string> = {
        ACTIVO: "Activo",
        DISPONIBLE: "Disponible",
        MANTENIMIENTO: "Mantenimiento",
        ALMACEN: "Almacén",
        BAJA: "Baja",
    };

    return statuses[status] ?? status;
}

function getStatusClass(status: string) {

    const classes: Record<string, string> = {
        ACTIVO: "rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-700",
        DISPONIBLE: "rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-700",
        MANTENIMIENTO: "rounded-full bg-yellow-100 px-2.5 py-1 text-xs text-yellow-700",
        ALMACEN: "rounded-full bg-purple-100 px-2.5 py-1 text-xs text-purple-700",
        BAJA: "rounded-full bg-red-100 px-2.5 py-1 text-xs text-red-700",
    };

    return (
        classes[status] ??
        "rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
    );
}

export default UserDetailsModal;