import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // 1. Importar RouterModule
import { NewAccommodation } from '../../../../core/models/landlord.models';

@Component({
  selector: 'app-accommodation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 2. Añadir RouterModule a los imports
  templateUrl: './accommodation-form.component.html',
  styleUrls: ['./accommodation-form.component.css']
})
export class AccommodationFormComponent {
  newAccommodation: NewAccommodation = {
    title: '',
    description: '',
    rooms: null,
    price: null,
    location: '',
    nearbyUniversities: '',
    roomiesAllowed: false,
    floor: null,
    images: []
  };

  onFileSelected(event: any) {
    if (event.target.files) {
      this.newAccommodation.images = Array.from(event.target.files);
      console.log('Archivos seleccionados:', this.newAccommodation.images);
    }
  }

  onSubmit() {
    if (this.newAccommodation.description.length < 50) {
      alert('La descripción debe tener al menos 50 caracteres.');
      return;
    }
    if (!this.newAccommodation.price || this.newAccommodation.price < 200 || this.newAccommodation.price > 5000) {
      alert('El precio debe estar entre S/200 y S/5000.');
      return;
    }
    if (this.newAccommodation.images.length === 0) {
      alert('Debes subir al menos una imagen.');
      return;
    }
    console.log('Enviando formulario:', this.newAccommodation);
    alert('¡Alojamiento publicado exitosamente!');
  }
}
