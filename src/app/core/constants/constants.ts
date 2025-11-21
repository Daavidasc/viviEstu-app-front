// src/app/core/constants/constants.ts

export interface SelectOption {
    id: number;
    nombre: string;
}

export const UNIVERSIDADES: SelectOption[] = [
    { id: 1, nombre: 'Universidad Nacional Mayor de San Marcos' },
    { id: 2, nombre: 'Pontificia Universidad Católica del Perú' },
    { id: 3, nombre: 'Universidad de Ingeniería y Tecnología' },
    { id: 4, nombre: 'Universidad Peruana de Ciencias Aplicadas' },
    { id: 5, nombre: 'Universidad de Lima' },
    // Agrega más universidades según sea necesario
];

export const DISTRITOS: SelectOption[] = [
    { id: 1, nombre: 'Miraflores' },
    { id: 2, nombre: 'San Isidro' },
    { id: 3, nombre: 'Surco' },
    { id: 4, nombre: 'Barranco' },
    { id: 5, nombre: 'Pueblo Libre' },
    // Agrega más distritos según sea necesario
];
