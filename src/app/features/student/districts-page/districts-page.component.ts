import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { DistrictCardComponent } from '../components/district-card/district-card.component';

import { LocationService } from '../../../core/services/location.service';
import { DistritoResponse } from '../../../core/models/location.models';

@Component({
  selector: 'app-districts-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, DistrictCardComponent],
  templateUrl: './districts-page.component.html',
  styleUrls: ['./districts-page.component.css']
})
export class DistrictsPageComponent implements OnInit {
  zones: DistritoResponse[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.locationService.getAllDistricts().subscribe({
      next: (data) => {
        this.zones = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar distritos:', err);
        this.error = 'Error al cargar los distritos. Por favor, intenta nuevamente.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
