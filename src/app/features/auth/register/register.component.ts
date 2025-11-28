import { AuthValidators } from './../validators/auth.validators';

import { AuthService } from './../../../core/services/auth.service';
import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
// CAMBIO CLAVE: Reemplazamos FormsModule por ReactiveFormsModule
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


import { HttpErrorResponse } from '@angular/common/http';
; // Asegúrate de que la ruta sea correcta

import { NavbarLandingComponent } from '../../../shared/components/navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { DISTRITOS, SelectOption, UNIVERSIDADES } from '../../../core/constants/constants';
import { RegisterEstudianteRequest, RegisterPropietarioRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  // CAMBIO CLAVE: Reemplazamos FormsModule por ReactiveFormsModule
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarLandingComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  // Inyección de servicios
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  // INYECTAMOS EL FORM BUILDER
  private fb = inject(FormBuilder);

  // ESTADO DE FORMULARIOS (Reactive Forms)
  studentForm!: FormGroup;
  ownerForm!: FormGroup;

  public universidades: SelectOption[] = UNIVERSIDADES;
  public distritos: SelectOption[] = DISTRITOS;


  userType: 'estudiante' | 'propietario' = 'estudiante';

  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      // NOTA: fullName validator es mejor para un solo campo, aquí se usa pattern para campos individuales
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],

      // Aplicamos el validador de DNI peruano
      dni: ['', [Validators.required, AuthValidators.peruvianDNI()]],

      // Aplicamos el validador de Teléfono
      telefono: ['', [Validators.required, AuthValidators.phoneNumber(9, 9)]], // Mínimo y máximo 9 para Perú

      correo: ['', [Validators.required, Validators.email]],

      // Aplicamos el validador de Contraseña fuerte
      contrasenia: ['', [Validators.required, AuthValidators.strongPassword(8)]],

      confirmarContrasenia: ['', [Validators.required]],

      // NOTA: Si necesitas confirmar contraseña, debes agregarla y aplicar passwordMatch al nivel del FormGroup
      // confirmarContrasenia: ['', [Validators.required]],

      carrera: ['', [Validators.required]],
      universidadId: [null, [Validators.required, Validators.min(1)]],
      ciclo: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      distritoId: [null, [Validators.required, Validators.min(1)]]
    }, {
      // Aplicamos el validador de passwordMatch a nivel de FormGroup
      validators: AuthValidators.passwordMatch('contrasenia', 'confirmarContrasenia')
    });

    this.ownerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],

      // Aplicamos el validador de DNI peruano
      dni: ['', [Validators.required, AuthValidators.peruvianDNI()]],

      correo: ['', [Validators.required, Validators.email]],

      // Contraseña y Confirmar Contraseña para Propietario
      contrasenia: ['', [Validators.required, AuthValidators.strongPassword(8)]],
      confirmarContrasenia: ['', [Validators.required]], // Nuevo campo para confirmación

      // Aplicamos el validador de Teléfono
      telefono: ['', [Validators.required, AuthValidators.phoneNumber(9, 9)]], // Mínimo y máximo 9 para Perú

    }, {
      // Aplicamos el validador de passwordMatch a nivel de FormGroup
      validators: AuthValidators.passwordMatch('contrasenia', 'confirmarContrasenia')
    });
  }

  // Función helper para obtener control de formulario
  getControl(form: FormGroup, name: string) {
    return form.get(name);
  }



  onRegister() {
    this.loading = true;
    this.errorMessage = null;

    if (this.userType === 'estudiante') {

      // Usamos el formulario reactivo para validar
      if (this.studentForm.invalid) {
        this.studentForm.markAllAsTouched();
        this.loading = false;
        return;
      }

      // Cast al modelo de datos para la llamada al servicio
      const data: RegisterEstudianteRequest = this.studentForm.value;

      this.authService.registerEstudiante(data).subscribe({
        next: () => {
          this.loading = false;
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/auth/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          if (err.status === 409) {
            this.errorMessage = 'El DNI o correo electrónico ya está registrado. Por favor, intenta iniciar sesión.';
          } else {
            this.errorMessage = err.error?.message || 'Error desconocido al registrar estudiante.';
          }
          this.cdr.detectChanges();
        }
      });

    } else { // propietario
      // Usamos el formulario reactivo para validar
      if (this.ownerForm.invalid) {
        this.ownerForm.markAllAsTouched();
        this.loading = false;
        return;
      }

      // Cast al modelo de datos para la llamada al servicio
      // Excluimos confirmarContrasenia del DTO, por eso hacemos destructuring
      const { confirmarContrasenia, ...data } = this.ownerForm.value;

      this.authService.registerPropietario(data as RegisterPropietarioRequest).subscribe({
        next: () => {
          this.loading = false;
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/auth/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          if (err.status === 409) {
            this.errorMessage = 'El DNI o correo electrónico ya está registrado. Por favor, intenta iniciar sesión.';
          } else {
            this.errorMessage = err.error?.message || 'Error desconocido al registrar propietario.';
          }
          this.cdr.detectChanges();

        }
      });
    }
  }
}
