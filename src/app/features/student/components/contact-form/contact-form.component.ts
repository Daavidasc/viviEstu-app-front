import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactFormViewModel } from '../../../../core/models/ui-view.models';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  @Input() accommodationId!: number;

  contactForm: ContactFormViewModel = {
    occupants: null,
    months: null,
    offer: null,
    message: ''
  };

  sendRequest() {
    console.log('Enviando solicitud de contacto:', this.contactForm);
    console.log('Alojamiento ID:', this.accommodationId);
    // Aquí se llamaría al servicio para enviar la solicitud, usando accommodationId y el ID del estudiante actual
    alert('Solicitud enviada al arrendador');
  }
}
