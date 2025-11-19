import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing';
import { FooterComponent } from '../../../shared/components/footer';

// Interfaces basadas en el diseño de la API REST
export interface LoginRequestDTO {
  correo: string;
  contrasenia: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarLandingComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequestDTO = {
    correo: '',
    contrasenia: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Intentando ingresar con:', this.loginData);

    // Simulación de llamada a la API
    setTimeout(() => {
      if (this.loginData.correo && this.loginData.contrasenia) {
        // Simulación de éxito
        console.log('Login exitoso');
        alert('¡Bienvenido!');
        // Aquí iría la redirección, por ejemplo: this.router.navigate(['/dashboard']);
      } else {
        // Simulación de error
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
      this.isLoading = false;
    }, 1500);
  }
}
