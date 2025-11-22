import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loading-overlay" [class.fullscreen]="fullscreen">
      <div class="spinner-container">
        <div class="spinner"></div>
        @if (message) {
          <p class="loading-text">{{ message }}</p>
        }
      </div>
    </div>
  `,
    styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
    @Input() message: string = 'Cargando...';
    @Input() fullscreen: boolean = false;
}
