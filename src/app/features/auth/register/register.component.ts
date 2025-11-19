import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarLandingComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Estado para controlar las pestañas
  userType: 'estudiante' | 'propietario' = 'estudiante';

  // Datos del formulario de estudiante
  studentData = {
    nombres: '',
    apellidos: '',
    correo: '',
    password: '',
    universidad: '',
    ciclo: '',
    distrito: ''
  };

  // Datos del formulario de propietario
  ownerData = {
    nombres: '',
    apellidos: '',
    correo: '',
    password: '',
    telefono: ''
  };

  constructor(private router: Router) {}

  onRegister() {
    if (this.userType === 'estudiante') {
      console.log('Registrando estudiante con datos:', this.studentData);
      // Lógica para registrar estudiante
      // Simulación de registro exitoso
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } else {
      console.log('Registrando propietario...');
      // Lógica para registrar propietario
      // Simulación de registro exitoso
      alert('¡Registro de propietario exitoso! Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);
    }
  }
}
