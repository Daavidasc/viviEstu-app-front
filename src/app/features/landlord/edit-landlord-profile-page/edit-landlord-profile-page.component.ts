import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 VITAL
import { Router, RouterModule } from '@angular/router';

import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

import { LandlordService } from '../../../core/services/landlord.service';
import { LandlordProfile } from '../../../core/models/landlord.models';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-edit-landlord-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LandlordNavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './edit-landlord-profile-page.component.html',
  styleUrls: ['./edit-landlord-profile-page.component.css']
})
export class EditLandlordProfilePageComponent implements OnInit {

  private landlordService = inject(LandlordService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  landlordData: LandlordProfile | null = null;
  isLoading = true;
  isSaving = false;

  ngOnInit() {
    this.loadProfile();
  }

loadProfile() {
    this.isLoading = true;
    this.landlordService.getProfile().subscribe({
      next: (data) => {
        this.landlordData = { ...data };
        this.isLoading = false;
        this.cd.detectChanges(); // 👈 AGREGA ESTO (Obliga a la vista a actualizarse)
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.isLoading = false;
        this.cd.detectChanges(); // 👈 TAMBIÉN AQUÍ (Por si falla, que quite el spinner)
        // this.router.navigate(['/landlord/profile']); // Opcional
      }
    });
  }

  onSubmit() {
    if (!this.landlordData) return;

    this.isSaving = true;

    this.landlordService.updateProfile(this.landlordData).subscribe({
      next: () => {
        console.log('Perfil actualizado');
        this.isSaving = false;
        alert('Perfil actualizado correctamente');
        this.router.navigate(['/landlord/profile']);
      },
      error: (err) => {
        console.error('Error actualizando:', err);
        alert('No se pudo actualizar el perfil.');
        this.isSaving = false;
      }
    });
  }
}
