import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// Servicios
import { AccommodationService } from '../../../../core/services/accommodation.service';
import { LocationService } from '../../../../core/services/location.service';
import { AuthService } from '../../../../core/services/auth.service';

// Modelos
import { AlojamientoRequestForm } from '../../../../core/models/accommodation.models';

@Component({
  selector: 'app-accommodation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './accommodation-form.component.html',
  styleUrls: ['./accommodation-form.component.css']
})
export class AccommodationFormComponent implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private accommodationService = inject(AccommodationService);
  private locationService = inject(LocationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estados reactivos con Signals
  uploadingImages = signal<boolean>(false);
  imageUrls = signal<string[]>([]);
  selectedFiles = signal<File[]>([]);
  submitting = signal<boolean>(false);

  // Listas para selectores
  districts = signal<any[]>([]);
  universities = signal<any[]>([]);
  transportOptions = ['Metro', 'Metropolitano', 'Corredor Azul', 'Corredor Rojo', 'Corredor Morado'];

  // FormGroup Reactivo
  accommodationForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadDistricts();
    this.loadUniversities();
  }

  private initializeForm(): void {
    this.accommodationForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      precioMensual: [null, [Validators.required, Validators.min(200), Validators.max(5000)]],
      nroPartida: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(8)]],
      distritoId: [null, [Validators.required]],
      alquilado: [false],
      universidadesIds: [[], [Validators.required, this.minArrayLength(1)]],
      transportes: [[], [this.minArrayLength(1)]],
      habitaciones: [1, [Validators.min(1), Validators.max(10)]],
      banios: [1, [Validators.min(1), Validators.max(5)]],
      area: [null, [Validators.min(10), Validators.max(500)]],
      piso: [null, [Validators.min(1), Validators.max(30)]],
      servicios: [[]]
    });
  }

  private minArrayLength(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!Array.isArray(value) || value.length < min) {
        return { minArrayLength: { required: min, actual: value?.length || 0 } };
      }
      return null;
    };
  }

  // 👇 CORRECCIÓN AQUÍ: Usar getAllDistricts()
  private loadDistricts(): void {
    this.locationService.getAllDistricts().subscribe({
      next: (zones) => { // 'zones' ahora se infiere correctamente como DistritoResponse[]
        this.districts.set(zones);
      },
      error: (err) => {
        console.error('Error al cargar distritos:', err);
      }
    });
  }

  private loadUniversities(): void {
    this.locationService.getAllUniversities().subscribe({
      next: (universities) => {
        this.universities.set(universities);
      },
      error: (err) => {
        console.error('Error al cargar universidades:', err);
      }
    });
  }

  // ... (El resto de métodos: onFileSelected, removeImage, toggleTransport, toggleUniversity, onSubmit, etc. se mantienen igual) ...

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const currentImages = this.selectedFiles().length;
    const totalImages = currentImages + files.length;

    if (totalImages > 10) {
      alert(`Solo puedes subir un máximo de 10 imágenes. Actualmente tienes ${currentImages} imágenes.`);
      input.value = '';
      return;
    }

    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert('Algunas imágenes exceden el tamaño máximo de 5MB.');
      input.value = '';
      return;
    }

    this.selectedFiles.update(current => [...current, ...files]);

    files.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      this.imageUrls.update(current => [...current, previewUrl]);
    });

    input.value = '';
  }

  removeImage(index: number): void {
    const urlToRevoke = this.imageUrls()[index];
    URL.revokeObjectURL(urlToRevoke);
    this.imageUrls.update(current => current.filter((_, i) => i !== index));
    this.selectedFiles.update(current => current.filter((_, i) => i !== index));
  }

  toggleTransport(transport: string): void {
    const currentTransports = this.accommodationForm.get('transportes')?.value || [];
    const index = currentTransports.indexOf(transport);
    if (index > -1) currentTransports.splice(index, 1);
    else currentTransports.push(transport);
    this.accommodationForm.patchValue({ transportes: [...currentTransports] });
  }

  isTransportSelected(transport: string): boolean {
    const transports = this.accommodationForm.get('transportes')?.value || [];
    return transports.includes(transport);
  }

  toggleUniversity(universityId: number): void {
    const currentUniversities = this.accommodationForm.get('universidadesIds')?.value || [];
    const index = currentUniversities.indexOf(universityId);
    if (index > -1) currentUniversities.splice(index, 1);
    else currentUniversities.push(universityId);
    this.accommodationForm.patchValue({ universidadesIds: [...currentUniversities] });
  }

  isUniversitySelected(universityId: number): boolean {
    const universities = this.accommodationForm.get('universidadesIds')?.value || [];
    return universities.includes(universityId);
  }

  async onSubmit(): Promise<void> {
    this.accommodationForm.markAllAsTouched();

    if (this.accommodationForm.invalid) {
      alert('Por favor, completa todos los campos requeridos correctamente.');
      this.scrollToFirstError();
      return;
    }

    if (this.selectedFiles().length === 0) {
      alert('Debes subir al menos una imagen del alojamiento.');
      return;
    }

    try {
      this.submitting.set(true);
      this.uploadingImages.set(true);

      const currentUser = this.authService.currentUser();
      if (!currentUser) throw new Error('Usuario no autenticado');

      const accommodationData: AlojamientoRequestForm = {
        ...this.accommodationForm.value,
        propietarioId: currentUser.id,
        imagenes: this.selectedFiles()
      };

      this.accommodationService.createAccommodation(accommodationData).subscribe({
        next: (response) => {
          console.log('Alojamiento creado:', response);
          alert('¡Alojamiento publicado exitosamente!');
          this.router.navigate(['/landlord/dashboard']);
        },
        error: (err) => {
          console.error('Error al crear alojamiento:', err);
          alert(err.error?.message || 'Error al publicar el alojamiento.');
        },
        complete: () => {
          this.submitting.set(false);
          this.uploadingImages.set(false);
        }
      });

    } catch (error) {
      console.error('Error en el proceso:', error);
      alert('Ocurrió un error al publicar el alojamiento.');
      this.submitting.set(false);
      this.uploadingImages.set(false);
    }
  }

  private scrollToFirstError(): void {
    const firstElementWithError = document.querySelector('.ng-invalid');
    firstElementWithError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  getControl(name: string): AbstractControl | null {
    return this.accommodationForm.get(name);
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.getControl(fieldName);
    return !!(control?.hasError(errorType) && control?.touched);
  }

  ngOnDestroy(): void {
    this.imageUrls().forEach(url => URL.revokeObjectURL(url));
  }
}
