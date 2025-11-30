import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ComentarioResponse } from '../../../core/models/interaction.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-comment-moderation',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    templateUrl: './comment-moderation.component.html',
    styleUrls: ['./comment-moderation.component.css']
})
export class CommentModerationComponent implements OnInit {
    private adminService = inject(AdminService);

    comments = signal<ComentarioResponse[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadComments();
    }

    loadComments() {
        this.loading.set(true);
        this.adminService.getComments().subscribe({
            next: (data) => {
                this.comments.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading comments', err);
                this.loading.set(false);
            }
        });
    }

    deleteComment(comment: ComentarioResponse) {
        if (confirm(`¿Estás seguro de eliminar este comentario?`)) {
            this.adminService.deleteComment(comment.id).subscribe({
                next: () => this.loadComments(),
                error: (err) => console.error('Error deleting comment', err)
            });
        }
    }
}
