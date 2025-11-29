// student.models.ts
export interface EstudianteProfileResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    carrera: string;
    ciclo: number;
    dni: string;
    universidadId?: number;
    distritoId?: number;

    // Mantén estos para mostrar el texto si quieres, o elimínalos
    universidad?: string;
    distrito?: string;
}

// Alias opcional para frontend
export type StudentProfile = EstudianteProfileResponse;
