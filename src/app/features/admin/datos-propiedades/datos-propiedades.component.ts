import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
    selector: 'app-datos-propiedades',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './datos-propiedades.component.html',
    styleUrl: './datos-propiedades.component.css'
})
export class DatosPropiedadesComponent {
    private fb = inject(FormBuilder);
    private adminService = inject(AdminService);

    propertyForm: FormGroup = this.fb.group({
        nroPartida: ['', [Validators.required]],
        dniPropietario: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });

    isSubmitting = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    isFieldInvalid(fieldName: string): boolean {
        const field = this.propertyForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit() {
        if (this.propertyForm.valid) {
            this.isSubmitting = true;
            this.message = '';

            this.adminService.addPropertyData(this.propertyForm.value).subscribe({
                next: () => {
                    this.message = 'Datos guardados exitosamente';
                    this.messageType = 'success';
                    this.propertyForm.reset();
                    this.isSubmitting = false;
                },
                error: (error) => {
                    console.error('Error adding property data:', error);
                    this.message = 'Error al guardar los datos. Por favor intente nuevamente.';
                    this.messageType = 'error';
                    this.isSubmitting = false;
                }
            });
        } else {
            this.propertyForm.markAllAsTouched();
        }
    }
}
