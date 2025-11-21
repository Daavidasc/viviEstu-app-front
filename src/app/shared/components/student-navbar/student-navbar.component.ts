import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentProfileViewModel } from '../../../core/models/ui-view.models';

@Component({
  selector: 'app-student-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-navbar.component.html',
  styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent {
  @Input() currentUser: StudentProfileViewModel | null = null;
  imageLoadError = false;

  handleImageError() {
    this.imageLoadError = true;
  }
}
