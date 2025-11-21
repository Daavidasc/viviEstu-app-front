import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ComparisonCardComponent } from '../components/comparison-card/comparison-card.component';
import { AccommodationCardViewModel } from '../../../core/models/ui-view.models';

@Component({
  selector: 'app-compare-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, ComparisonCardComponent],
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent {
  itemsToCompare: AccommodationCardViewModel[] = [
    {
      id: 1,
      title: 'Departamento en Surco',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 650,
      district: 'Surco',
      rooms: 1,
      baths: 1,
      area: 80,
      isFavorite: false
    },
    {
      id: 2,
      title: 'Departamento en Surco 2',
      thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 900,
      district: 'Surco',
      rooms: 2,
      baths: 2,
      area: 90,
      isFavorite: false
    }
  ];
}
