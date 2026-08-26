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
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">

                {/* HEADER */}

                <ModalHeader
                    name={user.name}
                    active={user.active}
                    onClose={onClose}
                />

                {/* BODY */}

                <div className="space-y-8 overflow-y-auto p-6">

                    <UserInformation user={user} />

                    <AssignedEquipment equipment={equipment} />

                </div>

                {/* FOOTER */}

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
    active: boolean;
    onClose: () => void;
}

function ModalHeader({
    name,
    active,
    onClose,
}: ModalHeaderProps) {

    return (
        <div className="flex items-center justify-between border-b px-6 py-4">

            <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 font-semibold text-white">
                    {getInitials(name)}
                </div>

                <div>

                    <div className="flex items-center gap-3">

                        <h2 className="text-lg font-semibold text-gray-900">
                            {name}
                        </h2>

                        <UserStatusBadge active={active} />

                    </div>

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
                Información del usuario
            </SectionTitle>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                <Info
                    label="Nombre"
                    value={user.name}
                />

                <Info
                    label="Departamento"
                    value={formatDepartment(user.department)}
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

                <Info
                    label="Fecha de registro"
                    value={formatDate(user.createdAt)}
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
        <div className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50">

            {/* ENCABEZADO */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                        <h4 className="truncate font-semibold text-gray-900">
                            {equipment.hostname}
                        </h4>

                        <StatusBadge
                            status={equipment.status}
                        />

                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        {getTypeLabel(equipment.type)} · {equipment.model}
                    </p>

                </div>

            </div>

            {/* INFORMACIÓN GENERAL */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <EquipmentInfo
                    label="Número de serie"
                    value={equipment.serialNumber}
                />

                <EquipmentInfo
                    label="Dirección IP"
                    value={equipment.ip}
                />

                <EquipmentInfo
                    label="Email"
                    value={equipment.email}
                />

                <EquipmentInfo
                    label="Tipo"
                    value={getTypeLabel(equipment.type)}
                />

                <EquipmentInfo
                    label="Modelo"
                    value={equipment.model}
                />

                <EquipmentInfo
                    label="Sistema operativo"
                    value={equipment.operatingSystem}
                />

                <EquipmentInfo
                    label="RAM"
                    value={equipment.ram}
                />

                <EquipmentInfo
                    label="Memoria"
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

            {/* COMPONENTES */}

            <div className="mt-4">

                <p className="mb-2 text-xs font-medium text-gray-500">
                    Componentes y servicios
                </p>

                <div className="flex flex-wrap gap-2">

                    <EquipmentFeature
                        label="Monitor"
                        enabled={equipment.monitor}
                    />

                    <EquipmentFeature
                        label="Back"
                        enabled={equipment.back}
                    />

                    <EquipmentFeature
                        label="Antivirus"
                        enabled={equipment.antivirus}
                    />

                </div>

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

            <p className="break-words text-sm font-medium text-gray-900">
                {value || "No especificado"}
            </p>

        </div>
    );
}

/* =========================================================
   EQUIPMENT FEATURE
========================================================= */

interface EquipmentFeatureProps {
    label: string;
    enabled: boolean;
}

function EquipmentFeature({
    label,
    enabled,
}: EquipmentFeatureProps) {

    return (
        <span
            className={
                enabled
                    ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                    : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
            }
        >
            {enabled ? "✓" : "−"} {label}
        </span>
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
        <div className="rounded-lg border border-gray-200 px-4 py-3">

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
   USER STATUS BADGE
========================================================= */

function UserStatusBadge({
    active,
}: {
    active: boolean;
}) {

    return (
        <span
            className={
                active
                    ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                    : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
            }
        >
            {active ? "Activo" : "Inactivo"}
        </span>
    );
}

/* =========================================================
   EQUIPMENT STATUS BADGE
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
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">

            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <span className="text-lg">
                    💻
                </span>
            </div>

            <p className="text-sm font-medium text-gray-700">
                Sin equipos asignados
            </p>

            <p className="mt-1 text-xs text-gray-500">
                Este usuario no tiene equipos asignados actualmente.
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
        <div className="flex justify-end border-t bg-gray-50 px-6 py-4">

            <button
                type="button"
                onClick={onClose}
                className="rounded-lg border bg-white px-4 py-2.5 transition hover:bg-gray-50"
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

/* =========================================================
   EQUIPMENT COUNT
========================================================= */

function getEquipmentCountText(count: number) {

    if (count === 0) {
        return "No tiene equipos asignados";
    }

    return `${count} equipo${count === 1 ? "" : "s"} asignado${count === 1 ? "" : "s"}`;
}

/* =========================================================
   DEPARTMENT LABEL
========================================================= */

function formatDepartment(department: string) {

    const departments: Record<string, string> = {

        AYB: "AYB",

        CONTABILIDAD: "Contabilidad",

        DIVISION_CUARTOS: "División Cuartos",

        E_COMMERCE: "E-Commerce",

        GERENCIA: "Gerencia",

        MANTENIMIENTO: "Mantenimiento",

        NOMINAS: "Nóminas",

        RECEPCION: "Recepción",

        RECURSOS_HUMANOS: "Recursos Humanos",

        SISTEMAS: "Sistemas",

        TELEFONOS: "Teléfonos",

        TIEMPO_COMPARTIDO: "Tiempo Compartido",

        VENTAS: "Ventas",
    };

    return departments[department] ?? department;
}

/* =========================================================
   EQUIPMENT TYPE LABEL
========================================================= */

function getTypeLabel(type: string) {

    const types: Record<string, string> = {

        LAPTOP: "Laptop",

        PC: "PC",

        ALL_IN_ONE: "All in One",

    };

    return types[type] ?? type;
}

/* =========================================================
   EQUIPMENT STATUS LABEL
========================================================= */

function getStatusLabel(status: string) {

    const statuses: Record<string, string> = {

        ACTIVO: "Activo",

        ALMACEN: "Almacén",

        BAJA: "Baja",

    };

    return statuses[status] ?? status;
}

/* =========================================================
   EQUIPMENT STATUS CLASS
========================================================= */

function getStatusClass(status: string) {

    const classes: Record<string, string> = {

        ACTIVO:
            "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700",

        ALMACEN:
            "rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700",

        BAJA:
            "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700",

    };

    return (
        classes[status] ??
        "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
    );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date: string) {

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
        year: "numeric",
    });
}

export default UserDetailsModal;