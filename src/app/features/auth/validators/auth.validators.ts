import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores específicos para el módulo de autenticación
 */
export class AuthValidators {

    // Validador para contraseñas que se repiten
    static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const password = formGroup.get(passwordField)?.value;
            const confirmPassword = formGroup.get(confirmPasswordField)?.value;

            if (!password || !confirmPassword) {
                return null;
            }

            // Asegurarse de que ambos campos hayan sido ingresados antes de validar
            if (formGroup.get(confirmPasswordField)?.pristine) {
                return null;
            }

            return password === confirmPassword ? null : { passwordMismatch: true };
        };
    }

    // Validador para la estructura de una contraseña fuertes
    static strongPassword(minLength: number = 8): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const value: string = control.value;
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumeric = /[0-9]/.test(value);
            // Requisito extra común: un carácter especial
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const hasMinLength = value.length >= minLength;

            const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasMinLength; // Simplificamos aquí, el weakPassword devuelve detalles

            return passwordValid ? null : {
                weakPassword: {
                    hasUpperCase: hasUpperCase,
                    hasLowerCase: hasLowerCase,
                    hasNumeric: hasNumeric,
                    hasSpecial: hasSpecial,
                    requiredLength: minLength,
                    actualLength: value.length
                }
            };
        };
    }

    // Validador para DNI peruano (8 dígitos exactos)
    static peruvianDNI(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const dniPattern = /^\d{8}$/;
            return dniPattern.test(control.value) ? null : { invalidPeruvianDNI: true };
        };
    }

    // Validador para número de teléfono (generalmente 9 dígitos en Perú, pero permitimos 9-15 por si acaso)
    static phoneNumber(minLength: number = 9, maxLength: number = 15): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const value: string = control.value.toString().replace(/\s/g, ''); // Limpiamos espacios

            const hasValidLength = value.length >= minLength && value.length <= maxLength;
            const isNumeric = /^\d+$/.test(value);

            if (!isNumeric) {
                return { notNumeric: true };
            }
            if (!hasValidLength) {
                return { invalidLength: { requiredMin: minLength, requiredMax: maxLength, actual: value.length } };
            }

            return null;
        };
    }

    // Validador para nombres y apellidos (comprobar solo dos palabras)
    static fullName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const words = control.value.trim().split(/\s+/).filter((word: string) => word.length > 0);
            return words.length >= 2 ? null : { invalidFullName: true };
        };
    }

}
