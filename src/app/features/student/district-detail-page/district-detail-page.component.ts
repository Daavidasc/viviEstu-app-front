import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { DistrictDetailViewModel } from '../../../core/models/ui-view.models';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-district-detail-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, RouterModule, FormsModule],
  templateUrl: './district-detail-page.component.html',
  styleUrls: ['./district-detail-page.component.css']
})
export class DistrictDetailPageComponent implements OnInit {
  zone: DistrictDetailViewModel | undefined;
  commentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.locationService.getDistrictById(id).subscribe(data => {
          this.zone = data;
        });
      }
    });
  }

  addComment(): void {
    if (this.commentText.trim()) {
      console.log('Comentario agregado:', this.commentText);
      this.commentText = '';



    }
  }
}
