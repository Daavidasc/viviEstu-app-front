import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './components/admin-topbar/admin-topbar.component';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [RouterOutlet, AdminSidebarComponent, AdminTopbarComponent],
    template: `
    <div class="admin-container">
      <app-admin-sidebar></app-admin-sidebar>
      <main class="main-content">
        <app-admin-topbar></app-admin-topbar>
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background-color: var(--accent-ivory);
    }

    .main-content {
      flex: 1;
      margin-left: 260px; /* Width of sidebar */
      display: flex;
      flex-direction: column;
    }

    .content-wrapper {
      padding: 30px;
      flex: 1;
    }
  `]
})
export class AdminComponent { }
