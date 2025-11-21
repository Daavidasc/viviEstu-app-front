import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccommodationDetailViewModel } from '../../../core/models/ui-view.models';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';

@Component({
  selector: 'app-accommodation-detail',
  standalone: true,
  imports: [FormsModule, StudentNavbarComponent, FooterComponent, GalleryComponent, ContactFormComponent],
  templateUrl: './accommodation-detail.component.html',
  styleUrls: ['./accommodation-detail.component.css']
})
export class AccommodationDetailComponent implements OnInit {
  accommodation: AccommodationDetailViewModel | null = null;
  newComment: string = '';

  // Array con todos los datos de prueba
  private allAccommodationDetails: AccommodationDetailViewModel[] = [
    {
      id: 1,
      titulo: 'Amplio y cómodo departamento',
      precioMensual: 650,
      descripcion: 'Amplio y comodo departamento cerca a la UPC Monterrico y ESAN. Ideal para estudiantes que buscan tranquilidad y cercanía a su centro de estudios.',
      imagenes: [
        { id: 1, url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
        { id: 2, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
        { id: 3, url: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }
      ],
      area: 80,
      banios: 1,
      habitaciones: 1,
      direccion: 'Jr. Alonso de Molina 1231 Monterrico',
      distrito: 'Surco',
      universidades: ['UPC MO', 'ESAN', 'UDEP'],
      transportes: ['Bicicleta', 'A pie', 'Bus'],
      estado: 'Disponible',
      propietario: 'Juan Perez',
      nroPartida: '12345678',
      fecha: '2023-11-20',
      latitud: -12.1,
      longitud: -77.0,
      alquilado: false,
      servicios: ['Internet', 'Agua', 'Luz'],
      securityLevelLabel: 'Alto',
      googleMapsUrl: 'https://maps.google.com',
      formattedDate: '20/11/2023',
      isFavorite: false
    },
    {
      id: 2,
      titulo: 'Moderno loft con vista a parque',
      precioMensual: 1200,
      descripcion: 'Moderno loft con vista a parque, zona segura. Incluye vigilancia. Perfecto para una persona o pareja.',
      imagenes: [
        { id: 4, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
        { id: 5, url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
        { id: 6, url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }
      ],
      area: 92,
      banios: 1,
      habitaciones: 2,
      direccion: 'Av. Primavera 567, San Borja',
      distrito: 'San Borja',
      universidades: ['Universidad de Lima'],
      transportes: ['Metropolitano', 'Corredor Rojo'],
      estado: 'Disponible',
      propietario: 'Maria Lopez',
      nroPartida: '87654321',
      fecha: '2023-11-15',
      latitud: -12.2,
      longitud: -77.1,
      alquilado: false,
      servicios: ['Internet', 'Agua', 'Luz', 'Vigilancia'],
      securityLevelLabel: 'Muy Alto',
      googleMapsUrl: 'https://maps.google.com',
      formattedDate: '15/11/2023',
      isFavorite: true
    }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Obtenemos el ID de la URL, lo convertimos a número y cargamos los datos
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAccommodationData(accommodationId);
  }

  loadAccommodationData(id: number) {
    // Buscamos el alojamiento en nuestro array de datos de prueba
    const foundAccommodation = this.allAccommodationDetails.find(acc => acc.id === id);
    if (foundAccommodation) {
      this.accommodation = foundAccommodation;
    } else {
      console.error(`Alojamiento con ID ${id} no encontrado.`);
    }
  }

  getImageUrls(): string[] {
    return this.accommodation?.imagenes.map(img => img.url) || [];
  }

  toggleFavorite() {
    if (this.accommodation) {
      this.accommodation.isFavorite = !this.accommodation.isFavorite;
      console.log('Favorito:', this.accommodation.isFavorite);
    }
  }

  postComment() {
    if (this.newComment.trim()) {
      console.log('Enviando comentario:', this.newComment);
      this.newComment = '';
      alert('¡Comentario enviado!');
    }
  }
}
