import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-edit-accommodation-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LandlordNavbarComponent, FooterComponent],
  templateUrl: './edit-accommodation-page.component.html',
  styleUrls: ['./edit-accommodation-page.component.css']
})
export class EditAccommodationPageComponent implements OnInit {
  editForm: FormGroup;
  accommodationId: number = 0;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accommodationService: AccommodationService
  ) {
    // Definimos solo los campos de DATOS (sin imágenes)
    this.editForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioMensual: [0, [Validators.required, Validators.min(1)]],
      direccion: ['', Validators.required],
      area: [0, Validators.min(1)],
      habitaciones: [1, Validators.min(1)],
      banios: [1, Validators.min(1)],
      alquilado: [false]
      // Agrega aquí 'nroPartida' si tu backend lo exige en el Update, si no, omítelo.
    });
  }

  ngOnInit(): void {
    this.accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.accommodationId) {
      this.loadData();
    }
  }

  loadData() {
    this.accommodationService.getAccommodationDetail(this.accommodationId).subscribe({
      next: (data) => {
        // Llenamos el formulario con los datos que vienen del backend
        this.editForm.patchValue({
          titulo: data.titulo,
          descripcion: data.descripcion,
          precioMensual: data.precioMensual,
          direccion: data.direccion,
          area: data.area,
          habitaciones: data.habitaciones,
          banios: data.banios,
          alquilado: data.alquilado
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos', err);
        alert('No se pudo cargar la información del alojamiento');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.editForm.invalid) return;

    this.isLoading = true;

    // Angular enviará esto como JSON automáticamente
    this.accommodationService.updateAccommodation(this.accommodationId, this.editForm.value)
      .subscribe({
        next: () => {
          alert('Alojamiento actualizado correctamente');
          // Volvemos a la pantalla de detalle para ver los cambios
          this.router.navigate(['/landlord/accommodations', this.accommodationId]);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Ocurrió un error al guardar los cambios.');
          this.isLoading = false;
        }
      });
  }

  onCancel() {
     this.router.navigate(['/landlord/accommodations', this.accommodationId]);
  }
}
