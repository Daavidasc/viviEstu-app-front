import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestViewModel, EstadoSolicitud } from '../../../../core/models/request.models';

@Component({
    selector: 'app-detailed-request',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './detailed-request.component.html',
    styleUrls: ['./detailed-request.component.css']
})
export class DetailedRequestComponent {
    @Input() request!: RequestViewModel;
    @Output() accept = new EventEmitter<number>();
    @Output() reject = new EventEmitter<number>();

    getStatusClass(status: EstadoSolicitud): string {
        switch (status) {
            case 'PENDIENTE': return 'status-pending';
            case 'ACEPTADO': return 'status-accepted';
            case 'AGENDADO': return 'status-scheduled';
            case 'RECHAZADO': return 'status-rejected';
            default: return 'status-pending';
        }
    }

    onAccept() {
        this.accept.emit(this.request.requestId);
    }

    onReject() {
        this.reject.emit(this.request.requestId);
    }
}
