import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarLandingComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loginData: LoginRequest = {
    correo: '',
    contrasenia: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';


    this.authService.login(this.loginData).pipe(
      timeout(30000) // Timeout de 30 segundos (para servidores en Render que despiertan)
    ).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);

        // Guardar token
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
      },
      error: (err) => {
        console.error('Login error', err);

        // Resetear estado de carga SIEMPRE
        this.isLoading = false;

        // Mensaje específico según el tipo de error
        if (err.name === 'TimeoutError') {
          this.errorMessage = 'El servidor tardó demasiado en responder (más de 30 segundos). Intenta de nuevo.';
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
