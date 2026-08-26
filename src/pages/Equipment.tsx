import { useEffect, useState } from "react";
import { api } from "../services/api";

import type {
    Equipment as EquipmentType,
    EquipmentStatus,
    EquipmentType as EquipmentTypeEnum,
} from "../types";

import EquipmentModal from "../components/EquipmentModal";
import EquipmentDetailsModal from "../components/EquipmentDetailsModal";
import AssignEquipmentModal from "../components/AssignEquipmentModal";

function Equipment() {
    const [equipment, setEquipment] = useState<EquipmentType[]>([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [viewMode, setViewMode] =
        useState<"table" | "cards">("table");

    const [modalOpen, setModalOpen] = useState(false);

    const [selectedEquipment, setSelectedEquipment] =
        useState<EquipmentType | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);

    // ======================================================
    // CARGAR EQUIPOS
    // ======================================================

    useEffect(() => {
        loadEquipment();
    }, []);

    async function loadEquipment() {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search.trim()) {
                params.set("search", search.trim());
            }

            if (status) {
                params.set("status", status);
            }

            if (type) {
                params.set("type", type);
            }

            const query = params.toString();

            const endpoint = query
                ? `/equipment?${query}`
                : "/equipment";

            const data = await api<EquipmentType[]>(endpoint);

            setEquipment(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al cargar equipos."
            );
        } finally {
            setLoading(false);
        }
    }

    // ======================================================
    // VER EQUIPO
    // ======================================================

    function handleView(item: EquipmentType) {
        setSelectedEquipment(item);
        setDetailsOpen(true);
    }

    // ======================================================
    // CREAR
    // ======================================================

    function handleCreate() {
        setSelectedEquipment(null);
        setModalOpen(true);
    }

    // ======================================================
    // EDITAR
    // ======================================================

    function handleEdit(item: EquipmentType) {
        setSelectedEquipment(item);
        setModalOpen(true);
    }

    // ======================================================
    // ASIGNAR
    // ======================================================

    function handleAssign(item?: EquipmentType) {
        if (item) {
            setSelectedEquipment(item);
        }

        setAssignOpen(true);
    }

    // ======================================================
    // CERRAR MODAL
    // ======================================================

    function handleCloseModal() {
        setModalOpen(false);
        setSelectedEquipment(null);
    }

    // ======================================================
    // CERRAR DETALLES
    // ======================================================

    function handleCloseDetails() {
        setDetailsOpen(false);
        setSelectedEquipment(null);
    }

    // ======================================================
    // CERRAR ASIGNACIÓN
    // ======================================================

    function handleCloseAssign() {
        setAssignOpen(false);
    }

    // ======================================================
    // BUSCAR
    // ======================================================

    function handleSearchSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        loadEquipment();
    }

    // ======================================================
    // TIPO
    // ======================================================

    function getTypeLabel(
        equipmentType: EquipmentTypeEnum
    ) {
        switch (equipmentType) {
            case "LAPTOP":
                return "Laptop";

            case "PC":
                return "PC";

            case "ALL_IN_ONE":
                return "All in One";

            default:
                return equipmentType;
        }
    }

    // ======================================================
    // ICONO TIPO
    // ======================================================

    function getTypeIcon(
        equipmentType: EquipmentTypeEnum
    ) {
        switch (equipmentType) {
            case "LAPTOP":
                return <LaptopIcon />;

            case "PC":
                return <PcIcon />;

            case "ALL_IN_ONE":
                return <AllInOneIcon />;

            default:
                return <EquipmentIcon />;
        }
    }

    // ======================================================
    // ESTADO
    // ======================================================

    function getStatusConfig(
        equipmentStatus: EquipmentStatus
    ) {
        switch (equipmentStatus) {
            case "ACTIVO":
                return {
                    label: "Activo",
                    className:
                        "bg-emerald-50 text-emerald-700 ring-emerald-100",
                    dot: "bg-emerald-500",
                };

            case "ALMACEN":
                return {
                    label: "Almacén",
                    className:
                        "bg-purple-50 text-purple-700 ring-purple-100",
                    dot: "bg-purple-500",
                };

            default:
                return {
                    label: equipmentStatus,
                    className:
                        "bg-slate-100 text-slate-600 ring-slate-200",
                    dot: "bg-slate-400",
                };
        }
    }

    // ======================================================
    // INICIALES
    // ======================================================

    function getInitials(name: string) {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) =>
                word.charAt(0).toUpperCase()
            )
            .join("");
    }

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                            <EquipmentIcon />
                        </div>

                        <div className="min-w-0">

                            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                                Equipos
                            </h1>

                            <p className="mt-0.5 text-sm text-slate-500">
                                Administración y gestión de equipos
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    type="button"
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
                        py-2.5
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
                    <PlusIcon />

                    Nuevo equipo
                </button>

            </div>

            {/* ==================================================
                CONTENEDOR PRINCIPAL
            ================================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* ==================================================
                    TOOLBAR
                ================================================== */}

                <div className="border-b border-slate-200 p-4 sm:p-5">

                    <div className="flex flex-col gap-4">

                        {/* TÍTULO */}

                        <div>

                            <h2 className="text-sm font-semibold text-slate-900">
                                Inventario de equipos
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                {equipment.length} equipo
                                {equipment.length !== 1 ? "s" : ""}
                                {" "}registrado
                                {equipment.length !== 1 ? "s" : ""}
                            </p>

                        </div>

                        {/* CONTROLES */}

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                            {/* BUSCADOR */}

                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex w-full gap-2 lg:flex-1"
                            >

                                <div className="relative min-w-0 flex-1">

                                    <SearchIcon />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Buscar equipo..."
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

                                <button
                                    type="submit"
                                    className="
                                        shrink-0
                                        rounded-xl
                                        bg-slate-900
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-slate-800
                                    "
                                >
                                    Buscar
                                </button>

                            </form>

                            {/* FILTROS */}

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">

                                <select
                                    value={status}
                                    onChange={(event) => {
                                        setStatus(event.target.value);
                                    }}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-slate-400
                                        focus:bg-white
                                        lg:w-auto
                                    "
                                >
                                    <option value="">
                                        Todos los estados
                                    </option>

                                    <option value="ACTIVO">
                                        Activo
                                    </option>

                                    <option value="ALMACEN">
                                        Almacén
                                    </option>
                                </select>

                                <select
                                    value={type}
                                    onChange={(event) => {
                                        setType(event.target.value);
                                    }}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-slate-400
                                        focus:bg-white
                                        lg:w-auto
                                    "
                                >
                                    <option value="">
                                        Todos los tipos
                                    </option>

                                    <option value="LAPTOP">
                                        Laptop
                                    </option>

                                    <option value="PC">
                                        PC
                                    </option>

                                    <option value="ALL_IN_ONE">
                                        All in One
                                    </option>
                                </select>

                            </div>

                            {/* VISTA */}

                            <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 p-1 sm:flex">

                                <ViewButton
                                    active={viewMode === "table"}
                                    title="Vista de tabla"
                                    onClick={() =>
                                        setViewMode("table")
                                    }
                                >
                                    <TableIcon />
                                </ViewButton>

                                <ViewButton
                                    active={viewMode === "cards"}
                                    title="Vista de tarjetas"
                                    onClick={() =>
                                        setViewMode("cards")
                                    }
                                >
                                    <CardsIcon />
                                </ViewButton>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading && (

                    <div className="flex flex-col items-center justify-center px-6 py-16">

                        <div className="
                            h-8
                            w-8
                            animate-spin
                            rounded-full
                            border-2
                            border-slate-200
                            border-t-slate-800
                        " />

                        <p className="mt-4 text-sm text-slate-500">
                            Cargando equipos...
                        </p>

                    </div>

                )}

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && !loading && (

                    <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 sm:m-5">

                        <div className="flex items-start gap-3">

                            <div className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-red-100
                                text-sm
                                font-bold
                                text-red-600
                            ">
                                !
                            </div>

                            <div className="min-w-0">

                                <p className="text-sm font-semibold text-red-800">
                                    No se pudieron cargar los equipos
                                </p>

                                <p className="mt-1 break-words text-sm text-red-700">
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>

                )}

                {/* ==================================================
                    CONTENIDO
                ================================================== */}

                {!loading && !error && (

                    <>
                        {/* ==================================================
                            TABLA — DESKTOP
                        ================================================== */}

                        {viewMode === "table" && (

                            <div className="hidden overflow-x-auto sm:block">

                                <table className="w-full min-w-[1100px]">

                                    <thead>

                                        <tr className="border-b border-slate-200 bg-slate-50/80">

                                            <TableHeader>
                                                Equipo
                                            </TableHeader>

                                            <TableHeader>
                                                Tipo
                                            </TableHeader>

                                            <TableHeader>
                                                Modelo
                                            </TableHeader>

                                            <TableHeader>
                                                Serial
                                            </TableHeader>

                                            <TableHeader>
                                                IP
                                            </TableHeader>

                                            <TableHeader>
                                                Usuario
                                            </TableHeader>

                                            <TableHeader>
                                                Estado
                                            </TableHeader>

                                            <TableHeader align="right">
                                                Acciones
                                            </TableHeader>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-100">

                                        {equipment.map((item) => {

                                            const statusConfig =
                                                getStatusConfig(item.status);

                                            return (

                                                <tr
                                                    key={item.id}
                                                    className="
                                                        group
                                                        transition-colors
                                                        hover:bg-slate-50/70
                                                    "
                                                >

                                                    {/* EQUIPO */}

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="
                                                                flex
                                                                h-10
                                                                w-10
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                bg-slate-100
                                                                text-slate-600
                                                                ring-1
                                                                ring-slate-200
                                                            ">
                                                                {getTypeIcon(item.type)}
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                                    {item.hostname}
                                                                </p>

                                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                                    {item.operatingSystem ||
                                                                        "Sin sistema operativo"}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* TIPO */}

                                                    <td className="px-6 py-4">

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-lg
                                                            bg-slate-100
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-slate-600
                                                            ring-1
                                                            ring-slate-200
                                                        ">
                                                            {getTypeIcon(item.type)}

                                                            {getTypeLabel(item.type)}
                                                        </span>

                                                    </td>

                                                    {/* MODELO */}

                                                    <td className="px-6 py-4 text-sm text-slate-700">
                                                        {item.model || "Sin modelo"}
                                                    </td>

                                                    {/* SERIAL */}

                                                    <td className="px-6 py-4">

                                                        <span className="
                                                            font-mono
                                                            text-xs
                                                            text-slate-600
                                                        ">
                                                            {item.serialNumber}
                                                        </span>

                                                    </td>

                                                    {/* IP */}

                                                    <td className="px-6 py-4">

                                                        <span className="
                                                            font-mono
                                                            text-xs
                                                            text-slate-600
                                                        ">
                                                            {item.ip || "Sin IP"}
                                                        </span>

                                                    </td>

                                                    {/* USUARIO */}

                                                    <td className="px-6 py-4">

                                                        {item.user ? (

                                                            <div className="flex items-center gap-2">

                                                                <div className="
                                                                    flex
                                                                    h-8
                                                                    w-8
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-blue-50
                                                                    text-xs
                                                                    font-bold
                                                                    text-blue-700
                                                                    ring-1
                                                                    ring-blue-100
                                                                ">
                                                                    {getInitials(
                                                                        item.user.name
                                                                    )}
                                                                </div>

                                                                <span className="
                                                                    max-w-[160px]
                                                                    truncate
                                                                    text-sm
                                                                    font-medium
                                                                    text-slate-700
                                                                ">
                                                                    {item.user.name}
                                                                </span>

                                                            </div>

                                                        ) : (

                                                            <span className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                rounded-lg
                                                                bg-slate-100
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                text-slate-500
                                                                ring-1
                                                                ring-slate-200
                                                            ">
                                                                <span className="
                                                                    h-1.5
                                                                    w-1.5
                                                                    rounded-full
                                                                    bg-slate-400
                                                                " />

                                                                Sin asignar
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* ESTADO */}

                                                    <td className="px-6 py-4">

                                                        <StatusBadge
                                                            config={statusConfig}
                                                        />

                                                    </td>

                                                    {/* ACCIONES */}

                                                    <td className="px-6 py-4">

                                                        <div className="
                                                            flex
                                                            items-center
                                                            justify-end
                                                            gap-1
                                                        ">

                                                            <ActionButton
                                                                title="Ver equipo"
                                                                onClick={() =>
                                                                    handleView(item)
                                                                }
                                                            >
                                                                <EyeIcon />
                                                            </ActionButton>

                                                            <ActionButton
                                                                title={
                                                                    item.user
                                                                        ? "Cambiar usuario"
                                                                        : "Asignar equipo"
                                                                }
                                                                onClick={() =>
                                                                    handleAssign(item)
                                                                }
                                                                hover="green"
                                                            >
                                                                <AssignIcon />
                                                            </ActionButton>

                                                            <ActionButton
                                                                title="Editar equipo"
                                                                onClick={() =>
                                                                    handleEdit(item)
                                                                }
                                                                hover="blue"
                                                            >
                                                                <EditIcon />
                                                            </ActionButton>

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
                            CARDS — MOBILE
                        ================================================== */}

                        <div
                            className={`
                                p-4
                                sm:p-5
                                ${
                                    viewMode === "cards"
                                        ? "block"
                                        : "block sm:hidden"
                                }
                            `}
                        >

                            <div className="
                                grid
                                grid-cols-1
                                gap-4
                                lg:grid-cols-2
                                xl:grid-cols-3
                            ">

                                {equipment.map((item) => (

                                    <EquipmentCard
                                        key={item.id}
                                        item={item}
                                        getInitials={getInitials}
                                        getTypeIcon={getTypeIcon}
                                        getTypeLabel={getTypeLabel}
                                        getStatusConfig={getStatusConfig}
                                        onView={handleView}
                                        onAssign={handleAssign}
                                        onEdit={handleEdit}
                                    />

                                ))}

                            </div>

                        </div>

                        {/* ==================================================
                            SIN RESULTADOS
                        ================================================== */}

                        {equipment.length === 0 && (

                            <EmptyState />

                        )}

                    </>
                )}

            </div>

            {/* ==================================================
                MODALES
            ================================================== */}

            <EquipmentModal
                isOpen={modalOpen}
                equipment={selectedEquipment}
                onClose={handleCloseModal}
                onSaved={loadEquipment}
            />

            <EquipmentDetailsModal
                isOpen={detailsOpen}
                equipment={selectedEquipment}
                onClose={handleCloseDetails}
                onAssign={() => {
                    setDetailsOpen(false);
                    setAssignOpen(true);
                }}
            />

            <AssignEquipmentModal
                isOpen={assignOpen}
                equipment={selectedEquipment}
                onClose={handleCloseAssign}
                onAssigned={async () => {

                    await loadEquipment();

                    if (selectedEquipment) {

                        const updated =
                            await api<EquipmentType>(
                                `/equipment/${selectedEquipment.id}`
                            );

                        setSelectedEquipment(updated);
                    }

                }}
            />

        </div>
    );
}

// ======================================================
// EQUIPMENT CARD
// ======================================================

interface EquipmentCardProps {
    item: EquipmentType;
    getInitials: (name: string) => string;
    getTypeIcon: (
        type: EquipmentTypeEnum
    ) => React.ReactNode;
    getTypeLabel: (
        type: EquipmentTypeEnum
    ) => string;
    getStatusConfig: (
        status: EquipmentStatus
    ) => {
        label: string;
        className: string;
        dot: string;
    };
    onView: (item: EquipmentType) => void;
    onAssign: (item: EquipmentType) => void;
    onEdit: (item: EquipmentType) => void;
}

function EquipmentCard({
    item,
    getInitials,
    getTypeIcon,
    getTypeLabel,
    getStatusConfig,
    onView,
    onAssign,
    onEdit,
}: EquipmentCardProps) {

    const statusConfig =
        getStatusConfig(item.status);

    return (

        <div className="
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
        ">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-600
                        ring-1
                        ring-slate-200
                    ">
                        {getTypeIcon(item.type)}
                    </div>

                    <div className="min-w-0">

                        <h3 className="
                            truncate
                            text-sm
                            font-bold
                            text-slate-900
                        ">
                            {item.hostname}
                        </h3>

                        <p className="
                            mt-0.5
                            truncate
                            text-xs
                            text-slate-500
                        ">
                            {getTypeLabel(item.type)}
                        </p>

                    </div>

                </div>

                <StatusBadge config={statusConfig} />

            </div>

            {/* INFORMACIÓN */}

            <div className="mt-5 space-y-3">

                <InfoRow
                    label="Modelo"
                    value={item.model || "Sin modelo"}
                />

                <InfoRow
                    label="Serial"
                    value={item.serialNumber}
                    mono
                />

                <InfoRow
                    label="IP"
                    value={item.ip || "Sin IP"}
                    mono
                />

                <InfoRow
                    label="Sistema"
                    value={
                        item.operatingSystem ||
                        "Sin sistema operativo"
                    }
                />

            </div>

            {/* USUARIO */}

            <div className="
                mt-5
                rounded-xl
                bg-slate-50
                p-3
            ">

                <p className="
                    mb-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                ">
                    Usuario asignado
                </p>

                {item.user ? (

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-xs
                            font-bold
                            text-blue-700
                            ring-1
                            ring-blue-100
                        ">
                            {getInitials(item.user.name)}
                        </div>

                        <div className="min-w-0">

                            <p className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                            ">
                                {item.user.name}
                            </p>

                            <p className="
                                truncate
                                text-xs
                                text-slate-500
                            ">
                                {item.user.email}
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-400
                    ">

                        <div className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-slate-400
                        ">
                            <UserIcon />
                        </div>

                        Sin asignar

                    </div>

                )}

            </div>

            {/* ACCIONES */}

            <div className="
                mt-5
                grid
                grid-cols-[1fr_1fr_auto]
                gap-2
                border-t
                border-slate-100
                pt-4
            ">

                <button
                    type="button"
                    onClick={() => onView(item)}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        px-3
                        py-2.5
                        text-xs
                        font-semibold
                        text-slate-600
                        transition
                        hover:bg-slate-50
                        hover:text-slate-900
                    "
                >
                    <EyeIcon />

                    Ver
                </button>

                <button
                    type="button"
                    onClick={() => onAssign(item)}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-emerald-100
                        bg-emerald-50
                        px-3
                        py-2.5
                        text-xs
                        font-semibold
                        text-emerald-700
                        transition
                        hover:bg-emerald-100
                    "
                >
                    <AssignIcon />

                    <span className="hidden xs:inline">
                        {item.user ? "Cambiar" : "Asignar"}
                    </span>

                    <span className="xs:hidden">
                        {item.user ? "Cambiar" : "Asignar"}
                    </span>

                </button>

                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    title="Editar equipo"
                    className="
                        flex
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-blue-100
                        bg-blue-50
                        px-3
                        py-2.5
                        text-blue-600
                        transition
                        hover:bg-blue-100
                    "
                >
                    <EditIcon />
                </button>

            </div>

        </div>
    );
}

// ======================================================
// INFO ROW
// ======================================================

interface InfoRowProps {
    label: string;
    value: string;
    mono?: boolean;
}

function InfoRow({
    label,
    value,
    mono = false,
}: InfoRowProps) {

    return (

        <div className="
            flex
            min-w-0
            items-center
            justify-between
            gap-4
        ">

            <span className="
                shrink-0
                text-xs
                font-medium
                text-slate-400
            ">
                {label}
            </span>

            <span
                className={`
                    min-w-0
                    truncate
                    text-right
                    text-sm
                    text-slate-700
                    ${mono ? "font-mono text-xs" : ""}
                `}
            >
                {value}
            </span>

        </div>
    );
}

// ======================================================
// STATUS BADGE
// ======================================================

interface StatusBadgeProps {
    config: {
        label: string;
        className: string;
        dot: string;
    };
}

function StatusBadge({
    config,
}: StatusBadgeProps) {

    return (

        <span
            className={`
                inline-flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-semibold
                ring-1
                ${config.className}
            `}
        >

            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${config.dot}
                `}
            />

            {config.label}

        </span>
    );
}

// ======================================================
// TABLE HEADER
// ======================================================

interface TableHeaderProps {
    children: React.ReactNode;
    align?: "left" | "right";
}

function TableHeader({
    children,
    align = "left",
}: TableHeaderProps) {

    return (

        <th
            className={`
                px-6
                py-4
                text-[11px]
                font-bold
                uppercase
                tracking-wider
                text-slate-500
                ${
                    align === "right"
                        ? "text-right"
                        : "text-left"
                }
            `}
        >
            {children}
        </th>
    );
}

// ======================================================
// VIEW BUTTON
// ======================================================

interface ViewButtonProps {
    active: boolean;
    title: string;
    onClick: () => void;
    children: React.ReactNode;
}

function ViewButton({
    active,
    title,
    onClick,
    children,
}: ViewButtonProps) {

    return (

        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`
                flex
                h-9
                w-10
                items-center
                justify-center
                rounded-lg
                transition
                ${
                    active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                }
            `}
        >
            {children}
        </button>
    );
}

// ======================================================
// ACTION BUTTON
// ======================================================

interface ActionButtonProps {
    title: string;
    onClick: () => void;
    children: React.ReactNode;
    hover?: "default" | "green" | "blue";
}

function ActionButton({
    title,
    onClick,
    children,
    hover = "default",
}: ActionButtonProps) {

    const hoverClass = {
        default:
            "hover:bg-slate-100 hover:text-slate-700",

        green:
            "hover:bg-emerald-50 hover:text-emerald-600",

        blue:
            "hover:bg-blue-50 hover:text-blue-600",

    }[hover];

    return (

        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`
                rounded-lg
                p-2
                text-slate-400
                transition
                ${hoverClass}
            `}
        >
            {children}
        </button>
    );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState() {

    return (

        <div className="
            flex
            flex-col
            items-center
            justify-center
            px-6
            py-16
            text-center
        ">

            <div className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-400
            ">
                <EquipmentIcon />
            </div>

            <h3 className="
                mt-4
                text-sm
                font-semibold
                text-slate-900
            ">
                No se encontraron equipos
            </h3>

            <p className="
                mt-1
                max-w-sm
                text-sm
                text-slate-500
            ">
                No hay equipos que coincidan con los filtros seleccionados.
            </p>

        </div>
    );
}

// ======================================================
// ICONOS
// ======================================================

function EquipmentIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >

            <rect
                x="3"
                y="4"
                width="18"
                height="13"
                rx="2"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 21h8M12 17v4"
            />

        </svg>
    );
}

function LaptopIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >

            <rect
                x="3"
                y="4"
                width="18"
                height="13"
                rx="2"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 20h20"
            />

        </svg>
    );
}

function PcIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >

            <rect
                x="3"
                y="3"
                width="18"
                height="14"
                rx="2"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 21h8M12 17v4"
            />

        </svg>
    );
}

function AllInOneIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >

            <rect
                x="3"
                y="4"
                width="18"
                height="13"
                rx="2"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 21h8M12 17v4"
            />

        </svg>
    );
}

function PlusIcon() {

    return (

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
    );
}

function SearchIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-400
            "
        >

            <circle
                cx="11"
                cy="11"
                r="7"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20 20-3.5-3.5"
            />

        </svg>
    );
}

function TableIcon() {

    return (

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
    );
}

function CardsIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >

            <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
            />

            <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
            />

            <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
            />

            <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
            />

        </svg>
    );
}

function EyeIcon() {

    return (

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

            <circle
                cx="12"
                cy="12"
                r="2.5"
            />

        </svg>
    );
}

function AssignIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >

            <circle
                cx="9"
                cy="7"
                r="4"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21v-2a6 6 0 0 1 6-6"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11h6M19 8v6"
            />

        </svg>
    );
}

function EditIcon() {

    return (

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
                d="M12 20h9"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
            />

        </svg>
    );
}

function UserIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >

            <circle
                cx="12"
                cy="8"
                r="4"
            />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 21a8 8 0 0 1 16 0"
            />

        </svg>
    );
}

export default Equipment;