import { AuthService } from './../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Necesario para routerLink y routerLinkActive


@Component({
  selector: 'app-student-navbar', // Renombrado a un selector más estándar
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-navbar.component.html', // Usaremos un archivo HTML para mayor claridad
  styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent {
 
  private authService = inject(AuthService);

  // Exponer el estado y los datos del usuario como señales de solo lectura
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;

  /**
   * Llama a la función de logout del servicio.
   */
  onLogout(): void {
    this.authService.logout();
  }
}
