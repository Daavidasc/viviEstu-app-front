import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ComparisonCardComponent } from '../components/comparison-card/comparison-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AccommodationCardViewModel } from '../../../core/models/accommodation.models';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-compare-page',
  standalone: true,
  imports: [
    CommonModule,
    StudentNavbarComponent,
    FooterComponent,
    ComparisonCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent implements OnInit {

  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);

  // Datos
  allFavorites: AccommodationCardViewModel[] = []; // Todos los favoritos disponibles
  itemsToCompare: AccommodationCardViewModel[] = []; // Los 2 que se están comparando actualmente

  // Estado UI
  isLoading = true;
  error: string | null = null;
  showChangeModal = false;
  targetSlotIndex: number = -1; // -1 indica ninguno, 0 es columna izq, 1 es columna der

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.studentService.getAllAccommodationsWithFavoriteStatus().subscribe({
      next: (data) => {
        // Guardamos TODOS los favoritos
        this.allFavorites = data.filter(item => item.isFavorite === true);

        // Inicializamos la comparación con los primeros 2
        this.itemsToCompare = this.allFavorites.slice(0, 2);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'No se pudieron cargar tus favoritos.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Abre el modal sabiendo qué columna queremos cambiar (0 o 1)
  openChangeModal(index: number) {
    this.targetSlotIndex = index;
    this.showChangeModal = true;
  }

  // Realiza el cambio
  selectReplacement(newItem: AccommodationCardViewModel) {
    if (this.targetSlotIndex !== -1) {
      // Reemplazamos el elemento en el índice seleccionado
      this.itemsToCompare[this.targetSlotIndex] = newItem;
      this.closeModal();
    }
  }

  closeModal() {
    this.showChangeModal = false;
    this.targetSlotIndex = -1;
  }

  // Filtra la lista del modal para no mostrar los que ya están en pantalla
  get availableReplacements(): AccommodationCardViewModel[] {
    const currentIds = this.itemsToCompare.map(i => i.id);
    return this.allFavorites.filter(fav => !currentIds.includes(fav.id));
  }
}
