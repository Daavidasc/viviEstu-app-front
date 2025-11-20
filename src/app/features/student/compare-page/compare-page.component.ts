import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ComparisonCardComponent } from '../components/comparison-card/comparison-card.component';
import { AccommodationDetail } from '../../../core/models/student.models';

@Component({
  selector: 'app-compare-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, ComparisonCardComponent],
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent {
  itemsToCompare: AccommodationDetail[] = [
    {
      id: 1,
      title: 'Departamento en Surco',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [],
      price: 650,
      description: 'Amplio y comodo departamento cerca a la UPC Monterrico y ESAN.',
      area: 80,
      baths: 1,
      rooms: 1,
      address: 'Jr. Alonso de Molina 1231 Monterrico',
      district: 'Surco',
      nearbyUniversities: ['UPC MO', 'ESAN', 'UDEP'],
      mobilityOptions: ['Bicicleta', 'A pie', 'Bus'],
      isFavorite: false
    },
    {
      id: 2,
      title: 'Departamento en Surco 2',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: [],
      price: 900,
      description: 'Amplio departamento cerca a la UPC Monterrico y ESAN.',
      area: 90,
      baths: 2,
      rooms: 2,
      address: 'Jr. Arnaldo Alvarado Degregori 305',
      district: 'Surco',
      nearbyUniversities: ['UPC MO', 'ESAN', 'UDEP'],
      mobilityOptions: ['Bicicleta', 'Bus'],
      isFavorite: false
    }
  ];
}
