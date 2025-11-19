import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactForm } from '../../../../core/models/student.models';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contactForm: ContactForm = {
    occupants: null,
    months: null,
    offer: null,
    message: ''
  };

  sendRequest() {
    console.log('Enviando solicitud de contacto:', this.contactForm);
    // Lógica para enviar formulario al backend
    alert('Solicitud enviada al arrendador');
  }
}
