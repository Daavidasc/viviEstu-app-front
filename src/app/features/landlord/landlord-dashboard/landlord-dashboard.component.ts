import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { RequestsSectionComponent } from '../components/requests-section/requests-section.component';
import { LandlordRentalCardComponent } from '../components/landlord-rental-card/landlord-rental-card.component';
import { RequestItem, MyRentalItem } from '../../../core/models/landlord.models';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, LandlordNavbarComponent, RequestsSectionComponent, LandlordRentalCardComponent],
  templateUrl: './landlord-dashboard.component.html',
  styleUrls: ['./landlord-dashboard.component.css']
})
export class LandlordDashboardComponent {
  userName: string = 'Henry';

  requests: RequestItem[] = [
    { id: 1, accommodationTitle: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.', applicantName: 'Marcelo Hernandez', status: 'reciente' },
    { id: 2, accommodationTitle: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.', applicantName: 'Marcelo Hernandez', status: 'reciente' },
    { id: 3, accommodationTitle: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.', applicantName: 'Marcelo Hernandez', status: 'reciente' },
  ];

  myRentals: MyRentalItem[] = [
    { id: 1, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 650, district: 'Monterrico', description: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.', area: 80, baths: 1, rooms: 1, clicks: 5, requestsCount: 1 },
    { id: 2, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 650, district: 'Monterrico', description: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.', area: 80, baths: 1, rooms: 1, clicks: 20, requestsCount: 15 }
  ];
}
