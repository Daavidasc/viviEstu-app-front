import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { DistrictCardComponent } from '../components/district-card/district-card.component';
import { DistritoResponse } from '../../../core/models/accommodation.models';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-districts-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, DistrictCardComponent],
  templateUrl: './districts-page.component.html',
  styleUrls: ['./districts-page.component.css']
})
export class DistrictsPageComponent {
  zones: DistritoResponse[] = [];

  constructor(private locationService: LocationService) {
    this.locationService.getZones().subscribe(data => {
      this.zones = data;
    });
  }
}
