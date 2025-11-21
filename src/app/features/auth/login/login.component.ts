import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
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

  loginData: LoginRequest = {
    correo: '',
    contrasenia: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

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
        this.isLoading = false;
      }
    });
  }
}
