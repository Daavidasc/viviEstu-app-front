import { AuthValidators } from './../validators/auth.validators';
import { AuthService } from './../../../core/services/auth.service';
import { LocationService } from '../../../core/services/location.service'; // IMPORTANTE: Importamos el servicio
import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NavbarLandingComponent } from '../../../shared/components/navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
// Ya no importamos DISTRITOS ni UNIVERSIDADES de constants, solo interfaces si es necesario
import { RegisterEstudianteRequest, RegisterPropietarioRequest } from '../../../core/models/auth.models';
import { DistritoResponse, UniversidadResponse } from '../../../core/models/location.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarLandingComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // Inyección de servicios
  private router = inject(Router);
  private authService = inject(AuthService);
  private locationService = inject(LocationService); // INYECCIÓN DEL LOCATION SERVICE
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  // ESTADO DE FORMULARIOS (Reactive Forms)
  studentForm!: FormGroup;
  ownerForm!: FormGroup;

  // CAMBIO: Ahora son arrays vacíos que se llenarán desde el servicio
  // Usamos las interfaces de respuesta del backend en lugar de SelectOption
  public universidades: UniversidadResponse[] = [];
  public distritos: DistritoResponse[] = [];

  userType: 'estudiante' | 'propietario' = 'estudiante';

  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // 1. Inicializamos los formularios
    this.initForms();

    // 2. Cargamos los datos de la base de datos (Distritos y Universidades)
    this.loadCatalogs();
  }

  // Método separado para inicializar formularios para mantener el orden
  initForms(): void {
    this.studentForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      dni: ['', [Validators.required, AuthValidators.peruvianDNI()]],
      telefono: ['', [Validators.required, AuthValidators.phoneNumber(9, 9)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, AuthValidators.strongPassword(8)]],
      confirmarContrasenia: ['', [Validators.required]],
      carrera: ['', [Validators.required]],
      universidadId: [null, [Validators.required, Validators.min(1)]],
      ciclo: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      distritoId: [null, [Validators.required, Validators.min(1)]]
    }, {
      validators: AuthValidators.passwordMatch('contrasenia', 'confirmarContrasenia')
    });

    this.ownerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,}$/)]],
      dni: ['', [Validators.required, AuthValidators.peruvianDNI()]],
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, AuthValidators.strongPassword(8)]],
      confirmarContrasenia: ['', [Validators.required]],
      telefono: ['', [Validators.required, AuthValidators.phoneNumber(9, 9)]],
    }, {
      validators: AuthValidators.passwordMatch('contrasenia', 'confirmarContrasenia')
    });
  }

  // NUEVO MÉTODO: Cargar datos desde el backend
  loadCatalogs(): void {
    // Cargar Distritos
    this.locationService.getAllDistricts().subscribe({
      next: (data) => {
        this.distritos = data;
        console.log('Distritos cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar distritos', err);
        // Opcional: Mostrar mensaje de error o usar datos fallback
      }
    });

    // Cargar Universidades (aprovechando que ya tienes el servicio)
    this.locationService.getAllUniversities().subscribe({
      next: (data) => {
        this.universidades = data;
        console.log('Universidades cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar universidades', err);
      }
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
      if (this.studentForm.invalid) {
        this.studentForm.markAllAsTouched();
        this.loading = false;
        return;
      }

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
            this.errorMessage = 'El DNI o correo electrónico ya está registrado.';
          } else {
            this.errorMessage = err.error?.message || 'Error desconocido al registrar estudiante.';
          }
          this.cdr.detectChanges();
        }
      });

    } else { // propietario
      if (this.ownerForm.invalid) {
        this.ownerForm.markAllAsTouched();
        this.loading = false;
        return;
      }

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
            this.errorMessage = 'El DNI o correo electrónico ya está registrado.';
          } else {
            this.errorMessage = err.error?.message || 'Error desconocido al registrar propietario.';
          }
          this.cdr.detectChanges();
        }
      });
    }
  }
}
