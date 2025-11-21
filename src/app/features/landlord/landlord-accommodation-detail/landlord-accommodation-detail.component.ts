import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from './../../../shared/components/footer';
import { GalleryComponent } from '../../student/components/gallery/gallery.component';
import { AccommodationRequestsListComponent } from '../components/accommodation-requests-list/accommodation-requests-list.component';
import { AccommodationService } from '../../../core/services/accommodation.service';
import { LandlordService } from '../../../core/services/landlord.service';
import { AccommodationDetailViewModel, LandlordRequestViewModel } from '../../../core/models/ui-view.models';

@Component({
  selector: 'app-landlord-accommodation-detail',
  standalone: true,
  imports: [FormsModule, RouterModule, LandlordNavbarComponent, FooterComponent, GalleryComponent, AccommodationRequestsListComponent],
  templateUrl: './landlord-accommodation-detail.component.html',
  styleUrls: ['./landlord-accommodation-detail.component.css']
})


export class LandlordAccommodationDetailComponent implements OnInit {
  accommodation: AccommodationDetailViewModel | null = null;
  requests: LandlordRequestViewModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private accommodationService: AccommodationService,
    private landlordService: LandlordService
  ) { }

  ngOnInit() {
    const accommodationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAccommodationData(accommodationId);
    this.loadRequests(accommodationId);
  }

  loadAccommodationData(id: number) {
    this.accommodationService.getAccommodationDetail(id).subscribe(data => {
      this.accommodation = data;
    });
  }

  loadRequests(id: number) {
    this.landlordService.getRequestsByAccommodationId(id).subscribe(data => {
      this.requests = data;
    });
  }

  getImageUrls(): string[] {
    return this.accommodation?.imagenes?.map(img => img.url) || [];
  }
}
