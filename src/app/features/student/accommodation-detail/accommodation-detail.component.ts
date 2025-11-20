import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccommodationDetail } from '../../../core/models/student.models';
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
  accommodation: AccommodationDetail | null = null;
  newComment: string = '';

  // Array con todos los datos de prueba
  private allAccommodationDetails: AccommodationDetail[] = [
    {
      id: 1,
      title: 'Amplio y cómodo departamento',
      price: 650,
      description: 'Amplio y comodo departamento cerca a la UPC Monterrico y ESAN. Ideal para estudiantes que buscan tranquilidad y cercanía a su centro de estudios.',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      area: 80,
      baths: 1,
      rooms: 1,
      address: 'Jr. Alonso de Molina 1231 Monterrico',
      district: 'Surco',
      nearbyUniversities: ['UPC MO', 'ESAN', 'UDEP'],
      mobilityOptions: ['Bicicleta', 'A pie', 'Bus'],
      isFavorite: false,
      image: '',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Moderno loft con vista a parque',
      price: 1200,
      description: 'Moderno loft con vista a parque, zona segura. Incluye vigilancia. Perfecto para una persona o pareja.',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      area: 92,
      baths: 1,
      rooms: 2,
      address: 'Av. Primavera 567, San Borja',
      district: 'San Borja',
      nearbyUniversities: ['Universidad de Lima'],
      mobilityOptions: ['Metropolitano', 'Corredor Rojo'],
      isFavorite: true,
      image: '',
      isFeatured: false
    }
  ];

  constructor(private route: ActivatedRoute) {}

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
      // Opcional: manejar el caso en que no se encuentre el ID
      console.error(`Alojamiento con ID ${id} no encontrado.`);
      // Aquí podrías redirigir a una página de "no encontrado"
    }
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
