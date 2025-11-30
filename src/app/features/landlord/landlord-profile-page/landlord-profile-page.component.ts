import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeout, catchError, of } from 'rxjs';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProfileHeaderCardComponent } from '../components/profile-header-card/profile-header-card.component';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { LandlordProfileViewModel } from '../../../core/models/landlord.models';
import { LandlordService } from '../../../core/services/landlord.service';


@Component({
  selector: 'app-landlord-profile-page',
  standalone: true,
  imports: [CommonModule, LandlordNavbarComponent, FooterComponent, ProfileHeaderCardComponent, ProfileInfoCardComponent],
  templateUrl: './landlord-profile-page.component.html',
  styleUrls: ['./landlord-profile-page.component.css']
})
export class LandlordProfilePageComponent implements OnInit {
  private landlordService = inject(LandlordService);
  private cdr = inject(ChangeDetectorRef);
  
  landlord: LandlordProfileViewModel | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;
    
    const startTime = Date.now();
    
    this.landlordService.getViewProfile().pipe(
      timeout(10000), // Timeout después de 10 segundos
      catchError((err) => {
        console.error('❌ Request failed or timed out:', err);
        throw err; // Re-throw para que el error handler lo capture
      })
    ).subscribe({
      next: (profile) => {
        const loadTime = Date.now() - startTime;
        //console.log('✅ Profile loaded successfully in', loadTime, 'ms:', profile);
        this.landlord = profile;
        this.loading = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
        //console.log('🔄 Change detection triggered, loading:', this.loading);
      },
      error: (err) => {
        const loadTime = Date.now() - startTime;
        //console.error('❌ Error loading profile after', loadTime, 'ms:', err);
        /*console.error('❌ Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });*/
        
        // Diferentes mensajes según el tipo de error
        if (err.name === 'TimeoutError') {
          this.error = 'La carga está tardando más de lo esperado. Verifica tu conexión.';
        } else if (err.status === 401) {
          this.error = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else if (err.status === 0) {
          this.error = 'No se puede conectar al servidor. Verifica tu conexión.';
        } else {
          this.error = 'Error al cargar el perfil. Por favor, intenta de nuevo.';
        }
        
        this.loading = false;
        this.cdr.detectChanges(); // Forzar detección de cambios también en error
        //console.log('🔄 Error state, change detection triggered');
      }
    });
  }
}
