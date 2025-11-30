import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-admin-topbar',
    standalone: true,
    templateUrl: './admin-topbar.component.html',
    styleUrls: ['./admin-topbar.component.css']
})
export class AdminTopbarComponent {
    private authService = inject(AuthService);

    logout() {
        this.authService.logout();
    }
}
