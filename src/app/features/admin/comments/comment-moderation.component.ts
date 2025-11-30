import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ComentarioResponse } from '../../../core/models/interaction.models';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar.component';

@Component({
    selector: 'app-comment-moderation',
    standalone: true,
    imports: [CommonModule, AdminSidebarComponent, AdminTopbarComponent],
    templateUrl: './comment-moderation.component.html',
    styleUrls: ['./comment-moderation.component.css']
})
export class CommentModerationComponent implements OnInit {
    private adminService = inject(AdminService);

    comments = signal<ComentarioResponse[]>([]);

    ngOnInit() {
        this.loadComments();
    }

    loadComments() {
        this.adminService.getComments().subscribe({
            next: (data) => this.comments.set(data),
            error: (err) => console.error('Error loading comments', err)
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
