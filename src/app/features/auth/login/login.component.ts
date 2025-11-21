import { AuthService } from './../../../core/services/auth.service';
// login.component.ts
import { ChangeDetectorRef, Component, inject } from '@angular/core'; // Añadir 'inject'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Importar Router
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing';
import { FooterComponent } from '../../../shared/components/footer';
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
        // Aquí podrías guardar más datos del usuario si es necesario
        alert('¡Bienvenido ' + response.name + '!');
        this.router.navigate(['/dashboard']); // Asumiendo ruta dashboard
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
