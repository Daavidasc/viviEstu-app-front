import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProfileHeaderCardComponent } from '../components/profile-header-card/profile-header-card.component';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component'; // 👈 Importa Spinner

import { LandlordProfile } from '../../../core/models/landlord.models';
import { LandlordService } from '../../../core/services/landlord.service';

@Component({
  selector: 'app-landlord-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    LandlordNavbarComponent,
    FooterComponent,
    ProfileHeaderCardComponent,
    ProfileInfoCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './landlord-profile-page.component.html',
  styleUrls: ['./landlord-profile-page.component.css']
})
export class LandlordProfilePageComponent implements OnInit {
  private landlordService = inject(LandlordService);
  private cdr = inject(ChangeDetectorRef);

  landlord: LandlordProfile | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.landlordService.getProfile().subscribe({
      next: (profile) => {
        this.landlord = profile;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error = 'Error al cargar el perfil.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
