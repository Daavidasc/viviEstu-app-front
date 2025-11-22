import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AccommodationService } from '../../../../core/services/accommodation.service';
import { LocationService } from '../../../../core/services/location.service';
import { AlojamientoRequestForm } from '../../../../core/models/accommodation.models';
import { AuthService } from '../../../../core/services/auth.service';

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

  /**
   * Inicializa el FormGroup con todas las validaciones de Reglas de Negocio
   */
  private initializeForm(): void {
    this.accommodationForm = this.fb.group({
      // Información Básica
      titulo: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100)
      ]],

      // RN-009: Descripción mínimo 50 caracteres
      descripcion: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(500)
      ]],

      direccion: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],

      // RN-015: Precio entre 200 y 5000
      precioMensual: [null, [
        Validators.required,
        Validators.min(200),
        Validators.max(5000)
      ]],

      // RN-008: Número de Partida (formato numérico)
      nroPartida: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(8)
      ]],

      // Información de Ubicación
      distritoId: [null, [Validators.required]],

      // Configuración
      alquilado: [false],

      // Universidades cercanas (array)
      universidadesIds: [[], [Validators.required, this.minArrayLength(1)]],

      // Transportes (array)
      transportes: [[], [this.minArrayLength(1)]],

      // Campos adicionales opcionales
      habitaciones: [1, [Validators.min(1), Validators.max(10)]],
      banios: [1, [Validators.min(1), Validators.max(5)]],
      area: [null, [Validators.min(10), Validators.max(500)]],
      piso: [null, [Validators.min(1), Validators.max(30)]],
      servicios: [[]]
    });
  }

  /**
   * Validador personalizado: Mínimo de elementos en un array
   */
  private minArrayLength(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!Array.isArray(value) || value.length < min) {
        return { minArrayLength: { required: min, actual: value?.length || 0 } };
      }
      return null;
    };
  }

  /**
   * Carga la lista de distritos disponibles
   */
  private loadDistricts(): void {
    this.locationService.getAllZones().subscribe({
      next: (zones) => {
        this.districts.set(zones);
      },
      error: (err) => {
        console.error('Error al cargar distritos:', err);
      }
    });
  }

  /**
   * Carga la lista de universidades disponibles
   */
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

  /**
   * RN-014: Manejo de selección de archivos (máximo 10 imágenes)
   * Genera previsualizaciones usando URL.createObjectURL()
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const currentImages = this.selectedFiles().length;
    const totalImages = currentImages + files.length;

    // RN-014: Validación de cantidad máxima de imágenes
    if (totalImages > 10) {
      alert(`Solo puedes subir un máximo de 10 imágenes. Actualmente tienes ${currentImages} imágenes.`);
      input.value = ''; // Limpiar input
      return;
    }

    // Validar tamaño de archivos (máximo 5MB por imagen)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert('Algunas imágenes exceden el tamaño máximo de 5MB. Por favor, selecciona imágenes más pequeñas.');
      input.value = '';
      return;
    }

    // Agregar archivos seleccionados
    this.selectedFiles.update(current => [...current, ...files]);

    // Generar previsualizaciones
    files.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      this.imageUrls.update(current => [...current, previewUrl]);
    });

    // Limpiar input para permitir seleccionar los mismos archivos nuevamente
    input.value = '';
  }

  /**
   * Elimina una imagen de la lista de previsualizaciones
   */
  removeImage(index: number): void {
    // Liberar memoria del objeto URL
    const urlToRevoke = this.imageUrls()[index];
    URL.revokeObjectURL(urlToRevoke);

    // Actualizar arrays
    this.imageUrls.update(current => current.filter((_, i) => i !== index));
    this.selectedFiles.update(current => current.filter((_, i) => i !== index));
  }

  /**
   * Toggle de selección de transportes
   */
  toggleTransport(transport: string): void {
    const currentTransports = this.accommodationForm.get('transportes')?.value || [];
    const index = currentTransports.indexOf(transport);

    if (index > -1) {
      // Remover si ya está seleccionado
      currentTransports.splice(index, 1);
    } else {
      // Agregar si no está seleccionado
      currentTransports.push(transport);
    }

    this.accommodationForm.patchValue({ transportes: [...currentTransports] });
  }

  /**
   * Verifica si un transporte está seleccionado
   */
  isTransportSelected(transport: string): boolean {
    const transports = this.accommodationForm.get('transportes')?.value || [];
    return transports.includes(transport);
  }

  /**
   * Toggle de selección de universidades
   */
  toggleUniversity(universityId: number): void {
    const currentUniversities = this.accommodationForm.get('universidadesIds')?.value || [];
    const index = currentUniversities.indexOf(universityId);

    if (index > -1) {
      currentUniversities.splice(index, 1);
    } else {
      currentUniversities.push(universityId);
    }

    this.accommodationForm.patchValue({ universidadesIds: [...currentUniversities] });
  }

  /**
   * Verifica si una universidad está seleccionada
   */
  isUniversitySelected(universityId: number): boolean {
    const universities = this.accommodationForm.get('universidadesIds')?.value || [];
    return universities.includes(universityId);
  }

  /**
   * Envío del formulario con validación completa y subida de imágenes
   */
  async onSubmit(): Promise<void> {
    // Marcar todos los campos como touched para mostrar errores
    this.accommodationForm.markAllAsTouched();

    // Validar formulario
    if (this.accommodationForm.invalid) {
      alert('Por favor, completa todos los campos requeridos correctamente.');
      this.scrollToFirstError();
      return;
    }

    // RN-014: Validar que haya al menos 1 imagen
    if (this.selectedFiles().length === 0) {
      alert('Debes subir al menos una imagen del alojamiento.');
      return;
    }

    try {
      this.submitting.set(true);
      this.uploadingImages.set(true);

      // 1. Subir imágenes y obtener URLs
      //const imageUrls = await this.uploadImages();

      // 2. Obtener ID del propietario autenticado
      const currentUser = this.authService.currentUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      // 3. Preparar el DTO para enviar al backend
      const accommodationData: AlojamientoRequestForm = {
        ...this.accommodationForm.value,
        propietarioId: currentUser.id,
        imagenes: this.selectedFiles() // El servicio convertirá a FormData
      };

      // 4. Enviar al backend
      this.accommodationService.createAccommodation(accommodationData).subscribe({
        next: (response) => {
          console.log('Alojamiento creado exitosamente:', response);
          alert('¡Alojamiento publicado exitosamente!');

          // Redirigir al dashboard del propietario
          this.router.navigate(['/landlord/dashboard']);
        },
        error: (err) => {
          console.error('Error al crear alojamiento:', err);
          alert(err.error?.message || 'Error al publicar el alojamiento. Intenta nuevamente.');
        },
        complete: () => {
          this.submitting.set(false);
          this.uploadingImages.set(false);
        }
      });

    } catch (error) {
      console.error('Error en el proceso de publicación:', error);
      alert('Ocurrió un error al publicar el alojamiento.');
      this.submitting.set(false);
      this.uploadingImages.set(false);
    }
  }

  /**
   * Sube las imágenes seleccionadas y retorna un array de URLs
   * NOTA: Esto asume que tienes un endpoint para subir imágenes
   * Si usas Cloudinary u otro servicio, ajusta la lógica aquí
   
  private async uploadImages(): Promise<string[]> {
    const uploadPromises = this.selectedFiles().map(file =>
      this.accommodationService.uploadImage(file).toPromise()
    );

    const results = await Promise.all(uploadPromises);
    return results.map(result => result!.url);
  }
  */

  /**
   * Desplaza la vista al primer campo con error
   */
  private scrollToFirstError(): void {
    const firstElementWithError = document.querySelector('.ng-invalid');
    firstElementWithError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Helper para obtener un control del formulario
   */
  getControl(name: string): AbstractControl | null {
    return this.accommodationForm.get(name);
  }

  /**
   * Verifica si un campo tiene un error específico y ha sido touched
   */
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.getControl(fieldName);
    return !!(control?.hasError(errorType) && control?.touched);
  }

  /**
   * Limpieza de recursos al destruir el componente
   */
  ngOnDestroy(): void {
    // Liberar memoria de las URLs de objetos creadas
    this.imageUrls().forEach(url => URL.revokeObjectURL(url));
  }
}
