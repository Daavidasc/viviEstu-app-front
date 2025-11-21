import { AuthService } from './../../../core/services/auth.service';
// login.component.ts
import { ChangeDetectorRef, Component, inject } from '@angular/core'; // Añadir 'inject'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Importar Router
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoginRequest } from '../../../core/models/user.model';


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
  private router = inject(Router); // Para la redirección
  private cdr = inject(ChangeDetectorRef);

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        localStorage.setItem('token', response.token);

        // Decodificar JWT para obtener el rol del usuario
        try {
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          const role = payload.role; // "ROLE_PROPIETARIO" o "ROLE_ESTUDIANTE"
          const userId = payload.Id;

          // Guardar información del usuario
          localStorage.setItem('userId', userId.toString());
          localStorage.setItem('userRole', role);
          this.cdr.detectChanges();

          // Navegar según el rol
          if (role === 'ROLE_PROPIETARIO') {
            this.router.navigate(['/landlord/dashboard']);
          } else if (role === 'ROLE_ESTUDIANTE') {
            this.router.navigate(['/student/dashboard']);
          } else {
            this.errorMessage = 'Tipo de usuario no reconocido';
            this.isLoading = false;
            return;
          }

          this.isLoading = false;
        } catch (error) {
          console.error('Error al decodificar JWT:', error);
          this.errorMessage = 'Error al procesar la autenticación';
          this.isLoading = false;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage = 'Correo o contraseña incorrectos.';


        this.errorMessage = err.error?.message || 'Error al intentar iniciar sesión. Verifica tus credenciales.';
        this.isLoading = false;

      },
      complete: () => {
      }
    });
  }
}
