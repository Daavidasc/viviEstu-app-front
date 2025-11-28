import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 👇 CAMBIO: Importar ambos desde request.models.ts
import { ContactFormViewModel, SolicitudRequest } from '../../../../core/models/request.models';
import { RequestService } from '../../../../core/services/request.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  @Input() accommodationId!: number;
  @Input() studentId: number | null = null;

  contactForm: ContactFormViewModel = {
    occupants: null,
    months: null,
    offer: null,
    message: ''
  };

  isSending = false;

  constructor(private requestService: RequestService) { }

  sendRequest() {
    // 1. Validaciones
    if (!this.accommodationId || !this.studentId) {
      alert('Error: Datos incompletos (Falta ID alojamiento o estudiante).');
      return;
    }

    if (!this.contactForm.months || this.contactForm.months <= 0) {
      alert('Por favor, ingresa el número de meses de alquiler.');
      return;
    }

    this.isSending = true;

    // 2. Mapeo a SolicitudRequest (DTO del backend)
    const requestData: SolicitudRequest = {
      alojamientoId: this.accommodationId,
      estudiantesId: this.studentId,
      mesesAlquiler: this.contactForm.months,
      cantInquilinos: this.contactForm.occupants || 1,
      oferta: this.contactForm.offer || 0,
      mensaje: this.contactForm.message || ''
    };

    // 3. Envío
    this.requestService.sendRequest(requestData).subscribe({
      next: (response) => {
        console.log('✅ Solicitud enviada:', response);
        alert('Solicitud enviada al arrendador con éxito.');
        this.contactForm = { occupants: null, months: null, offer: null, message: '' };
        this.isSending = false;
      },
      error: (err) => {
        console.error('❌ Error al enviar solicitud:', err);
        alert('Error al enviar la solicitud. Por favor, intenta de nuevo.');
        this.isSending = false;
      }
    });
  }
}
