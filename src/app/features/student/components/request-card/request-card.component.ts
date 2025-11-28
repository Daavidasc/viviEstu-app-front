// src/app/student-profile/components/request-card/request-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core'; // Añadir Output y EventEmitter
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; //  Importar Router
import { RequestViewModel } from '../../../../core/models/request.models';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent {
  @Input() request!: RequestViewModel;

  // Evento para notificar al padre cuando se cancele la solicitud
  @Output() requestCancelled = new EventEmitter<number>();

  constructor(private router: Router) { } // 👈 Inyectar Router



  /**
   * Emite un evento para que el componente padre maneje la eliminación.
   */
  cancelRequest() {
    this.requestCancelled.emit(this.request.requestId);
  }
}
