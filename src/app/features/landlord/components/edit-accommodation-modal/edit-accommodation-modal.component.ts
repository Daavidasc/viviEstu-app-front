import { Component, inject, OnInit, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AccommodationService } from '../../../../core/services/accommodation.service';
import { LocationService } from '../../../../core/services/location.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AlojamientoRequestForm } from '../../../../core/models/accommodation.models';

@Component({
    selector: 'app-edit-accommodation-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-accommodation-modal.component.html',
    styleUrls: ['./edit-accommodation-modal.component.css']
})
export class EditAccommodationModalComponent implements OnInit {
    private fb = inject(FormBuilder);
    private accommodationService = inject(AccommodationService);
    private locationService = inject(LocationService);
    private authService = inject(AuthService);

    @Input() accommodationId!: number;
    @Output() close = new EventEmitter<void>();
    @Output() updated = new EventEmitter<void>();

    accommodationForm!: FormGroup;

    // Signals for state
    uploadingImages = signal<boolean>(false);
    imageUrls = signal<string[]>([]);
    selectedFiles = signal<File[]>([]);
    submitting = signal<boolean>(false);
    districts = signal<any[]>([]);
    universities = signal<any[]>([]);

    transportOptions = ['Metro', 'Metropolitano', 'Corredor Azul', 'Corredor Rojo', 'Corredor Morado'];

    ngOnInit(): void {
        this.initializeForm();
        this.loadDistricts();
        this.loadUniversities();

        if (this.accommodationId) {
            this.loadAccommodationData(this.accommodationId);
        }
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

    private loadAccommodationData(id: number): void {
        this.accommodationService.getAccommodationDetail(id).subscribe({
            next: (data) => {
                // Map names to IDs
                const district = this.districts().find(d => d.nombre === data.distrito);
                const districtId = district ? district.id : null;

                const universityIds: number[] = [];
                if (data.universidades) {
                    data.universidades.forEach(uniName => {
                        const uni = this.universities().find(u => u.nombre === uniName);
                        if (uni) universityIds.push(uni.id);
                    });
                }

                this.accommodationForm.patchValue({
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    direccion: data.direccion,
                    precioMensual: data.precioMensual,
                    nroPartida: data.nroPartida,
                    distritoId: districtId,
                    alquilado: data.alquilado,
                    universidadesIds: universityIds,
                    transportes: data.transportes || [],
                    habitaciones: data.habitaciones,
                    banios: data.banios,
                    area: data.area,
                    piso: 1, // Default
                    servicios: [] // Default
                });

                if (data.imagenes) {
                    this.imageUrls.set(data.imagenes.map(img => img.url));
                }
            },
            error: (err) => console.error('Error loading accommodation data', err)
        });
    }

    private loadDistricts(): void {
        this.locationService.getAllDistricts().subscribe({
            next: (zones) => this.districts.set(zones),
            error: (err) => console.error('Error loading districts:', err)
        });
    }

    private loadUniversities(): void {
        this.locationService.getAllUniversities().subscribe({
            next: (universities) => {
                const uniqueUniversities = universities.filter((uni, index, self) =>
                    index === self.findIndex((u) => u.nombre === uni.nombre)
                );
                this.universities.set(uniqueUniversities);
            },
            error: (err) => console.error('Error loading universities:', err)
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

    // Form helpers
    hasError(field: string, errorType: string): boolean {
        const control = this.accommodationForm.get(field);
        return !!(control && control.hasError(errorType) && control.touched);
    }

    getControl(field: string): AbstractControl | null {
        return this.accommodationForm.get(field);
    }

    // Checkbox handlers
    toggleTransport(transport: string): void {
        const currentTransports = this.accommodationForm.get('transportes')?.value || [];
        const index = currentTransports.indexOf(transport);
        if (index > -1) currentTransports.splice(index, 1);
        else currentTransports.push(transport);
        this.accommodationForm.patchValue({ transportes: [...currentTransports] });
    }

    isTransportSelected(transport: string): boolean {
        return (this.accommodationForm.get('transportes')?.value || []).includes(transport);
    }

    toggleUniversity(universityId: number): void {
        const currentUniversities = this.accommodationForm.get('universidadesIds')?.value || [];
        const index = currentUniversities.indexOf(universityId);
        if (index > -1) currentUniversities.splice(index, 1);
        else currentUniversities.push(universityId);
        this.accommodationForm.patchValue({ universidadesIds: [...currentUniversities] });
    }

    isUniversitySelected(universityId: number): boolean {
        return (this.accommodationForm.get('universidadesIds')?.value || []).includes(universityId);
    }

    // Image handlers
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const files = Array.from(input.files);
        const currentImages = this.selectedFiles().length;

        if (currentImages + files.length > 10) {
            alert('Máximo 10 imágenes permitidas.');
            return;
        }

        this.selectedFiles.update(current => [...current, ...files]);
        files.forEach(file => {
            const previewUrl = URL.createObjectURL(file);
            this.imageUrls.update(current => [...current, previewUrl]);
        });
    }

    removeImage(index: number): void {
        const urlToRevoke = this.imageUrls()[index];
        URL.revokeObjectURL(urlToRevoke);
        this.imageUrls.update(current => current.filter((_, i) => i !== index));
        this.selectedFiles.update(current => current.filter((_, i) => i !== index));
    }

    onSubmit(): void {
        if (this.accommodationForm.invalid) {
            this.accommodationForm.markAllAsTouched();
            return;
        }

        this.submitting.set(true);
        const currentUser = this.authService.currentUser();

        const accommodationData: AlojamientoRequestForm = {
            ...this.accommodationForm.value,
            propietarioId: currentUser?.id || 0,
            imagenes: this.selectedFiles()
        };

        this.accommodationService.updateAccommodation(this.accommodationId, accommodationData).subscribe({
            next: () => {
                this.updated.emit();
                this.close.emit();
            },
            error: (err) => {
                console.error('Error updating accommodation:', err);
                alert('Error al actualizar el alojamiento');
                this.submitting.set(false);
            },
            complete: () => this.submitting.set(false)
        });
    }
}
