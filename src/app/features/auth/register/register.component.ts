import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarLandingComponent } from '../../../shared/components/navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterEstudianteRequest, RegisterPropietarioRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarLandingComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

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

  onRegister() {
    if (this.userType === 'estudiante') {
      console.log('Registrando estudiante con datos:', this.studentData);

      // Mapeo a RegisterEstudianteRequest
      // TODO: Actualizar formulario para capturar DNI, Teléfono, Carrera y usar IDs reales para Distrito/Universidad
      const request: RegisterEstudianteRequest = {
        nombre: this.studentData.nombres,
        apellidos: this.studentData.apellidos,
        correo: this.studentData.correo,
        contrasenia: this.studentData.password,
        telefono: '999999999', // Mock
        carrera: 'Ingeniería', // Mock
        ciclo: Number(this.studentData.ciclo) || 1,
        dni: '00000000', // Mock
        distritoId: 1, // Mock
        universidadId: 1 // Mock
      };

      this.authService.registerStudent(request).subscribe({
        next: (response) => {
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Error registro estudiante', err);
          alert('Error en el registro.');
        }
      });

    } else {
      console.log('Registrando propietario...');

      // Mapeo a RegisterPropietarioRequest
      // TODO: Actualizar formulario para capturar DNI
      const request: RegisterPropietarioRequest = {
        nombre: this.ownerData.nombres,
        apellidos: this.ownerData.apellidos,
        correo: this.ownerData.correo,
        contrasenia: this.ownerData.password,
        telefono: this.ownerData.telefono,
        dni: '00000000' // Mock
      };

      this.authService.registerLandlord(request).subscribe({
        next: (response) => {
          alert('¡Registro de propietario exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Error registro propietario', err);
          alert('Error en el registro.');
        }
      });
    }
  }
}
