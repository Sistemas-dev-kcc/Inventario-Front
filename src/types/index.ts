
// ==========================================
// EQUIPMENT STATUS
// ==========================================

export type EquipmentStatus =
    | "ACTIVO"
    | "ALMACEN"
    | "BAJA";


// ==========================================
// EQUIPMENT TYPE
// ==========================================

export type EquipmentType =
    | "LAPTOP"
    | "PC"
    | "ALL_IN_ONE";


// ==========================================
// USER
// ==========================================

export interface User {

    id: string;

    name: string;

    department: string;

    position?: string | null;

    boss?: string | null;

    active: boolean;

    createdAt: string;

    equipment?: Equipment[];
}


// ==========================================
// EQUIPMENT
// ==========================================

export interface Equipment {

    id: string;

    email?: string | null;

    ip: string;

    serialNumber: string;

    hostname: string;

    model: string;

    type: EquipmentType;

    teamviewer?: string | null;

    operatingSystem: string;

    memory?: string | null;

    ram?: string | null;

    monitor: boolean;

    back: boolean;

    antivirus: boolean;

    warranty?: string | null;

    status: EquipmentStatus;

    userId?: string | null;

    user?: User | null;

    createdAt: string;

    updatedAt: string;
}


// ==========================================
// DASHBOARD
// ==========================================

export interface DashboardData {

    users: {
        total: number;

        active: number;

        inactive: number;
    };

    equipment: {

        // Total de equipos registrados
        total: number;

        // Equipos asignados y activos
        assigned: number;

        // Equipos disponibles
        warehouse: number;

        // Equipos dados de baja
        retired: number;

        // Total de equipos que no están dados de baja
        available: number;

        // Porcentajes
        assignedPercentage: number;

        warehousePercentage: number;

        retiredPercentage: number;
    };
}

