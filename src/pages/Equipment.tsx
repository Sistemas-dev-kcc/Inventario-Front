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

    // ==========================================
    // CARGAR EQUIPOS
    // ==========================================

    useEffect(() => {
        loadEquipment();
    }, []);

    async function loadEquipment() {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search.trim()) {
                params.set("search", search);
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

    // ==========================================
    // VER
    // ==========================================

    function handleView(item: EquipmentType) {
        setSelectedEquipment(item);
        setDetailsOpen(true);
    }

    // ==========================================
    // CREAR
    // ==========================================

    function handleCreate() {
        setSelectedEquipment(null);
        setModalOpen(true);
    }

    // ==========================================
    // EDITAR
    // ==========================================

    function handleEdit(item: EquipmentType) {
        setSelectedEquipment(item);
        setModalOpen(true);
    }

    // ==========================================
    // ASIGNAR
    // ==========================================

    function handleAssign(item?: EquipmentType) {
        if (item) {
            setSelectedEquipment(item);
        }

        setAssignOpen(true);
    }

    // ==========================================
    // CERRAR MODAL
    // ==========================================

    function handleCloseModal() {
        setModalOpen(false);
        setSelectedEquipment(null);
    }

    // ==========================================
    // CERRAR DETALLES
    // ==========================================

    function handleCloseDetails() {
        setDetailsOpen(false);
        setSelectedEquipment(null);
    }

    // ==========================================
    // CERRAR ASIGNAR
    // ==========================================

    function handleCloseAssign() {
        setAssignOpen(false);
    }

    // ==========================================
    // BUSCAR
    // ==========================================

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();

        loadEquipment();
    }

    // ==========================================
    // TIPO
    // ==========================================

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

    // ==========================================
    // ICONO TIPO
    // ==========================================

    function getTypeIcon(
        equipmentType: EquipmentTypeEnum
    ) {
        switch (equipmentType) {
            case "LAPTOP":
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

            case "PC":
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

            case "ALL_IN_ONE":
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

            default:
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
                            height="16"
                            rx="2"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 8h8M8 12h8M8 16h4"
                        />
                    </svg>
                );
        }
    }

    // ==========================================
    // ESTADO
    // ==========================================

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

    // ==========================================
    // INICIALES
    // ==========================================

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

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">

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

                        </div>

                        <div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Equipos
                            </h1>

                            <p className="mt-0.5 text-sm text-slate-500">
                                Administración y gestión de equipos
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
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
                            d="M12 5v14M5 12h14"
                        />
                    </svg>

                    Nuevo equipo

                </button>

            </div>

            {/* ==========================================
                CONTENEDOR
            ========================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* ==========================================
                    TOOLBAR
                ========================================== */}

                <div className="border-b border-slate-200 p-4 sm:p-5">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                        <div>

                            <h2 className="text-sm font-semibold text-slate-900">
                                Inventario de equipos
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                {equipment.length} equipo
                                {equipment.length !== 1 ? "s" : ""} registrado
                                {equipment.length !== 1 ? "s" : ""}
                            </p>

                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row">

                            {/* BUSCADOR */}

                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex w-full gap-3 lg:w-auto"
                            >

                                <div className="relative w-full lg:w-80">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Buscar equipo..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Buscar
                                </button>

                            </form>

                            {/* FILTROS */}

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
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
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
                                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
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

                            {/* VISTA */}

                            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setViewMode("table")
                                    }
                                    title="Vista de tabla"
                                    className={`
                                        rounded-lg p-2
                                        transition
                                        ${
                                            viewMode === "table"
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-400 hover:text-slate-700"
                                        }
                                    `}
                                >

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

                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setViewMode("cards")
                                    }
                                    title="Vista de cards"
                                    className={`
                                        rounded-lg p-2
                                        transition
                                        ${
                                            viewMode === "cards"
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-400 hover:text-slate-700"
                                        }
                                    `}
                                >

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

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                    LOADING
                ========================================== */}

                {loading && (

                    <div className="flex flex-col items-center justify-center px-6 py-16">

                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />

                        <p className="mt-4 text-sm text-slate-500">
                            Cargando equipos...
                        </p>

                    </div>

                )}

                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && !loading && (

                    <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4">

                        <p className="text-sm font-semibold text-red-800">
                            No se pudieron cargar los equipos
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>

                    </div>

                )}

                {/* ==========================================
                    CONTENIDO
                ========================================== */}

                {!loading && !error && (

                    <>
                        {viewMode === "table" ? (

                            /* ======================================
                               TABLA
                            ====================================== */

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[1100px]">

                                    <thead>

                                        <tr className="border-b border-slate-200 bg-slate-50/80">

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                Equipo
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                Tipo
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                Modelo
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                Serial
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                IP
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                Usuario
                                            </th>

                                            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                Estado
                                            </th>

                                            <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                Acciones
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-100">

                                        {equipment.map((item) => {

                                            const statusConfig =
                                                getStatusConfig(item.status);

                                            return (

                                                <tr
                                                    key={item.id}
                                                    className="group transition-colors hover:bg-slate-50/70"
                                                >

                                                    {/* EQUIPO */}

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                                                                {getTypeIcon(item.type)}
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                                    {item.hostname}
                                                                </p>

                                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                                    {item.operatingSystem || "Sin sistema operativo"}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* TIPO */}

                                                    <td className="px-6 py-4">

                                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">

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

                                                        <span className="font-mono text-xs text-slate-600">
                                                            {item.serialNumber}
                                                        </span>

                                                    </td>

                                                    {/* IP */}

                                                    <td className="px-6 py-4">

                                                        <span className="font-mono text-xs text-slate-600">
                                                            {item.ip || "Sin IP"}
                                                        </span>

                                                    </td>

                                                    {/* USUARIO */}

                                                    <td className="px-6 py-4">

                                                        {item.user ? (

                                                            <div className="flex items-center gap-2">

                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                                                                    {getInitials(item.user.name)}
                                                                </div>

                                                                <span className="text-sm font-medium text-slate-700">
                                                                    {item.user.name}
                                                                </span>

                                                            </div>

                                                        ) : (

                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">

                                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />

                                                                Sin asignar

                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* ESTADO */}

                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusConfig.className}`}
                                                        >

                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                                                            />

                                                            {statusConfig.label}

                                                        </span>

                                                    </td>

                                                    {/* ACCIONES */}

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center justify-end gap-1">

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

                        ) : (

                            /* ======================================
                               CARDS
                            ====================================== */

                            <div className="p-5 sm:p-6">

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                                    {equipment.map((item) => {

                                        const statusConfig =
                                            getStatusConfig(item.status);

                                        return (

                                            <div
                                                key={item.id}
                                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                            >

                                                {/* HEADER CARD */}

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                                                            {getTypeIcon(item.type)}
                                                        </div>

                                                        <div className="min-w-0">

                                                            <h3 className="truncate text-sm font-bold text-slate-900">
                                                                {item.hostname}
                                                            </h3>

                                                            <p className="mt-0.5 text-xs text-slate-500">
                                                                {getTypeLabel(item.type)}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <span
                                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusConfig.className}`}
                                                    >

                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                                                        />

                                                        {statusConfig.label}

                                                    </span>

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

                                                <div className="mt-5 border-t border-slate-100 pt-4">

                                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                        Usuario asignado
                                                    </p>

                                                    {item.user ? (

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                                                                {getInitials(item.user.name)}
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                                    {item.user.name}
                                                                </p>

                                                                <p className="truncate text-xs text-slate-500">
                                                                    {item.user.email}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    ) : (

                                                        <div className="flex items-center gap-2 text-sm text-slate-400">

                                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">

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

                                                            </span>

                                                            Sin asignar

                                                        </div>

                                                    )}

                                                </div>

                                                {/* ACCIONES CARD */}

                                                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">

                                                    <button
                                                        onClick={() =>
                                                            handleView(item)
                                                        }
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                                                    >
                                                        <EyeIcon />
                                                        Ver
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleAssign(item)
                                                        }
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                                    >
                                                        <AssignIcon />

                                                        {item.user
                                                            ? "Cambiar"
                                                            : "Asignar"}
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="flex items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                                                        title="Editar equipo"
                                                    >
                                                        <EditIcon />
                                                    </button>

                                                </div>

                                            </div>

                                        );
                                    })}

                                </div>

                            </div>

                        )}

                        {/* ==========================================
                            SIN RESULTADOS
                        ========================================== */}

                        {equipment.length === 0 && (

                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                                    {getTypeIcon("PC")}

                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                    No se encontraron equipos
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-slate-500">
                                    No hay equipos que coincidan con los filtros seleccionados.
                                </p>

                            </div>

                        )}

                    </>
                )}

            </div>

            {/* ==========================================
                MODALES
            ========================================== */}

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


// ==========================================
// INFO ROW
// ==========================================

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
        <div className="flex items-center justify-between gap-4">

            <span className="text-xs font-medium text-slate-400">
                {label}
            </span>

            <span
                className={`
                    truncate text-right text-sm text-slate-700
                    ${mono ? "font-mono text-xs" : ""}
                `}
            >
                {value}
            </span>

        </div>
    );
}


// ==========================================
// ACTION BUTTON
// ==========================================

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
            onClick={onClick}
            title={title}
            className={`rounded-lg p-2 text-slate-400 transition ${hoverClass}`}
        >
            {children}
        </button>
    );
}


// ==========================================
// ICONO VER
// ==========================================

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


// ==========================================
// ICONO ASIGNAR
// ==========================================

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


// ==========================================
// ICONO EDITAR
// ==========================================

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


export default Equipment;