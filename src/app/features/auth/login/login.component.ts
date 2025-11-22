import { AuthService } from './../../../core/services/auth.service';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing';
import { FooterComponent } from '../../../shared/components/footer';
// Asegúrate de importar RoleType
import { LoginRequest, RoleType } from '../../../core/models/user.model';


export interface LoginRequestDTO {
  correo: string;
  contrasenia: string;
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent, NavbarLandingComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequest = {
    correo: '',
    contrasenia: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  // Inyectar servicios
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // NOTA IMPORTANTE: Debes reemplazar 'alert()' por un modal o mensaje en el UI.
  // Lo dejé para este ejemplo, pero en un entorno real NO se debe usar alert().
  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        // La información de sesión (token, user) ya se guarda en AuthService.saveAuthData

        alert('¡Bienvenido ' + response.name + '!' + response.role);
        this.isLoading = false;

        // 💡 LÓGICA DE REDIRECCIÓN POR ROL 💡
        const userRole = response.role;

        switch (userRole) {
          case RoleType.ROLE_ESTUDIANTE:
            this.router.navigate(['/student/dashboard']);
            break;

          case RoleType.ROLE_PROPIETARIO:
            this.router.navigate(['/landlord/dashboard']);
            break;

          case RoleType.ROLE_ADMIN:
            // Si tienes un módulo de admin, usa su ruta
            this.router.navigate(['/admin/dashboard']);
            break;

          default:
                    alert('Quefue');
            console.warn('Rol desconocido o no asignado, redirigiendo a la ruta por defecto.');
            this.router.navigate(['/']); // Redirigir a la landing page o acceso denegado
            break;
        }

      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage = err.error?.message || 'Error al intentar iniciar sesión. Verifica tus credenciales.';
        this.isLoading = false;
      },
      complete: () => {
      }
    });
  }
}
