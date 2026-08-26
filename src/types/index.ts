// ==========================================
// EQUIPMENT STATUS
// ==========================================

export type EquipmentStatus =
    | "ACTIVO"
    | "ALMACEN";


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

    email: string;

    department?: string | null;

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
        total: number;

        assigned: number;

        available: number;

        warehouse: number;
    };
}