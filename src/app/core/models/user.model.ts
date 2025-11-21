// ====================================================================
// 1. Tipos de Rol (ENUM)
// Coinciden con los tipos definidos en tu backend (RoleType.java)
// ====================================================================

export enum RoleType {
    ROLE_ESTUDIANTE = 'ROLE_ESTUDIANTE',
    ROLE_PROPIETARIO = 'ROLE_PROPIETARIO',
    ROLE_ADMIN = 'ROLE_ADMIN',
}

// ====================================================================
// 2. PETICIONES (REQUESTS)
// Coinciden con tus DTOs de Java
// ====================================================================

/**
 * Modelo para la solicitud de Login
 * Coincide con LoginRequestDTO
 */
export interface LoginRequest {
    correo: string;
    contrasenia: string;
}

/**
 * Modelo para la solicitud de Registro de Estudiante
 * Coincide con RegisterEstudianteRequestDTO
 */
export interface RegisterEstudianteRequest {
    correo: string;
    contrasenia: string;
    nombre: string; // Nombre en singular en el DTO
    apellidos: string;
    telefono: string;
    carrera: string;
    ciclo: number; // Es Integer en Java, usamos number en TypeScript
    dni: string;
    distritoId: number; // Es Long en Java, usamos number en TypeScript
    universidadId: number; // Es Long en Java, usamos number en TypeScript
}

/**
 * Modelo para la solicitud de Registro de Propietario
 * Coincide con RegisterPropietarioRequestDTO
 */
export interface RegisterPropietarioRequest {
    nombre: string;
    apellidos: string;
    correo: string;
    contrasenia: string;
    telefono: string;
    dni: string;
}

// ====================================================================
// 3. RESPUESTAS (RESPONSES)
// Coinciden con AuthResponseDTO de Java (con una adición necesaria)
// ====================================================================

/**
 * Respuesta del backend tras Login o Registro exitoso.
 * Coincide con AuthResponseDTO (token, correo, nombre).
 * **NOTA**: Se añade 'role' para uso interno del frontend (como se vio en el AuthService).
 */
export interface AuthResponse {
    token: string;
    // type: string; // Opcional, solo si quieres guardarlo
    email: string; // 👈 CORREGIDO: De correo a email
    name: string;  // 👈 CORREGIDO: De nombre a name
    role?: RoleType;
}

/**
 * Modelo completo del Usuario para el estado compartido y almacenamiento local
 * (UserResponse).
 */
export interface UserResponse {
    id: string; // ID del usuario (puede ser null/string/number, ajusta si el BE lo devuelve)
    email: string;
    name: string;
    role: RoleType;
    active: boolean;
    createdAt: string; // Usamos string para las fechas ISO
    updatedAt: string;
}
