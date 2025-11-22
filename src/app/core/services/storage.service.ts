import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Guarda un ítem en LocalStorage.
   * Si el valor]
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, serializedValue);
    } catch (e) {
      console.error('Error saving to LocalStorage', e);
    }
  }

  /**
   * Obtiene un ítem de LocalStorage y lo deserializa si es necesario.
   * @returns El valor
   *
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }

      // Intentar deserializar (útil para objetos UserResponse)
      try {
        return JSON.parse(item) as T;
      } catch (e) {
        // Si falla la deserialización, devolver el string original (útil para el token)
        return item as unknown as T;
      }
    } catch (e) {
      console.error('Error getting from LocalStorage', e);
      return null;
    }
  }

  /**
   * Elimina un ítem de LocalStorage.
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from LocalStorage', e);
    }
  }

  /**
   * Limpia todo LocalStorage (usar con precaución).
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing LocalStorage', e);
    }
  }
}
