import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { DistrictCardComponent } from '../components/district-card/district-card.component';
import { Zone } from '../../../core/models/student.models';

@Component({
  selector: 'app-districts-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, DistrictCardComponent],
  templateUrl: './districts-page.component.html',
  styleUrls: ['./districts-page.component.css']
})
export class DistrictsPageComponent {
  zones: Zone[] = [
    { id: 1, name: 'Surco', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Surquillo', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'San Isidro', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Miraflores', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Chorrillos', image: 'https://images.unsplash.com/photo-1558036117-15db527544f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 6, name: 'Lince', image: 'https://images.unsplash.com/photo-1600596542815-277d62eab2b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 7, name: 'Lima', image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 8, name: 'Barranco', image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  ];
}
