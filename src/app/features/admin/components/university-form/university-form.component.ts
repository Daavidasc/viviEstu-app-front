import { Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../../../core/services/location.service';
import { DistritoResponse } from '../../../../core/models/location.models';

@Component({
    selector: 'app-university-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './university-form.component.html',
    styleUrls: ['./university-form.component.css']
})
export class UniversityFormComponent implements OnInit {
    @Input() university: any = null;
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private locationService = inject(LocationService);

    universityForm: FormGroup;
    districts = signal<DistritoResponse[]>([]);
    isEdit = false;

    constructor() {
        this.universityForm = this.fb.group({
            nombre: ['', Validators.required],
            distritoId: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadDistricts();
        if (this.university) {
            this.isEdit = true;
            this.universityForm.patchValue({
                nombre: this.university.nombre
            });
        }
    }

    loadDistricts() {
        this.locationService.getAllDistricts().subscribe({
            next: (data) => {
                this.districts.set(data);
                if (this.isEdit && this.university?.distritoNombre) {
                    const dist = data.find(d => d.nombre === this.university.distritoNombre);
                    if (dist) {
                        this.universityForm.patchValue({ distritoId: dist.id });
                    }
                }
            },
            error: (err) => console.error('Error loading districts', err)
        });
    }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit() {
        if (this.universityForm.valid) {
            this.save.emit(this.universityForm.value);
        }
    }
}
