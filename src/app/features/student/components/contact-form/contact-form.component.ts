import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactFormViewModel } from '../../../../core/models/ui-view.models';
import { SolicitudRequest } from '../../../../core/models/interaction.models'; // Importar la interfaz de solicitud
import { RequestService } from '../../../../core/services/request.service'; // Importar el nuevo servicio

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  // Acepta el ID del alojamiento como antes
  @Input() accommodationId!: number;
  // **NUEVO:** Acepta el ID del estudiante
  @Input() studentId: number | null = null;

  contactForm: ContactFormViewModel = {
    occupants: null,
    months: null,
    offer: null,
    message: ''
  };

  isSending = false; // Estado para el botón

  constructor(private requestService: RequestService) { } // Inyectar el servicio

  sendRequest() {
    // 1. Validar datos mínimos y la disponibilidad de IDs
    if (!this.accommodationId || !this.studentId) {
      alert('Error: Datos incompletos para enviar la solicitud (ID de Alojamiento o Estudiante faltante).');
      return;
    }

    // El DTO del backend requiere mesesAlquiler, oferta (no nulo) y IDs.
    if (!this.contactForm.months || this.contactForm.months <= 0) {
      alert('Por favor, ingresa el número de meses de alquiler.');
      return;
    }

    this.isSending = true;

    // 2. Mapear los datos del formulario al DTO del backend
    const requestData: SolicitudRequest = {
      alojamientoId: this.accommodationId,
      estudiantesId: this.studentId,
      mesesAlquiler: this.contactForm.months,
      // Asume 1 si no se especifica, si el campo es obligatorio en el backend.
      cantInquilinos: this.contactForm.occupants || 1,
      // Si el backend requiere que 'oferta' no sea nulo, envía 0 o el precio base si no hay oferta.
      // Aquí se enviará lo que el usuario puso, o 0 si no puso nada, y asumimos que el backend lo acepta.
      oferta: this.contactForm.offer || 0,
      mensaje: this.contactForm.message || ''
    };

    // 3. Llamar al servicio
    this.requestService.sendRequest(requestData).subscribe({
      next: (response) => {
        console.log('✅ Solicitud enviada exitosamente:', response);
        alert('✅ Solicitud enviada al arrendador con éxito.');
        // Opcional: Limpiar el formulario
        this.contactForm = { occupants: null, months: null, offer: null, message: '' };
        this.isSending = false;
      },
      error: (err) => {
        console.error('❌ Error al enviar solicitud:', err);
        alert('❌ Error al enviar la solicitud. Por favor, intenta de nuevo.');
        this.isSending = false;
      }
    });
  }
}
