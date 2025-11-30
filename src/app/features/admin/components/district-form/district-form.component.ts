import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-district-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './district-form.component.html',
    styleUrls: ['./district-form.component.css']
})
export class DistrictFormComponent implements OnInit {
    @Input() district: any = null;
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    districtForm: FormGroup;
    isEdit = false;

    constructor() {
        this.districtForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: [''],
            precioProm: [0, [Validators.required, Validators.min(0)]],
            tipo: ['', Validators.required],
            urlImg: [''],
            seguridad: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
        });
    }

    ngOnInit() {
        if (this.district) {
            this.isEdit = true;
            this.districtForm.patchValue(this.district);
        }
    }

    onCancel() {
        this.cancel.emit();
    }

    onSubmit() {
        if (this.districtForm.valid) {
            this.save.emit(this.districtForm.value);
        }
    }
}
