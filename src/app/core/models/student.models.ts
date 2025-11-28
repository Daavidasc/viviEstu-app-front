// DTO del Backend (Perfil puro)
export interface EstudianteProfileResponse {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    carrera: string;
    ciclo: number;
    dni: string;
    distrito: string;
    universidad: string;
    urlFotoPerfil?: string;
}

// ViewModel (Para el Frontend - Dashboard)
export interface StudentProfileViewModel extends EstudianteProfileResponse {
    fullName: string; // nombre + apellidos
    university?: string;
    district?: string;
    age?: number;     // Dato calculado o mock
    preferredZone?: string;
    budget?: number;
    avatarUrl?: string;
}
