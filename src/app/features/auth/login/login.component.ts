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
  // Usar LoginRequest del modelo
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
    console.log('Intentando ingresar con:', this.loginData);

    // Llama al servicio de autenticación
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // En el tap del AuthService ya se guarda el token y el usuario.
        console.log('Login exitoso. Token:', response.token);

        // Redirige al usuario al área protegida (ej: dashboard)
        this.router.navigate(['/dashboard']); // <-- AJUSTA ESTA RUTA SEGÚN TU APP
      },
      error: (err) => {
        console.error('Error de Login:', err);
        this.errorMessage = err.error?.message || 'Error al intentar iniciar sesión. Verifica tus credenciales.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
