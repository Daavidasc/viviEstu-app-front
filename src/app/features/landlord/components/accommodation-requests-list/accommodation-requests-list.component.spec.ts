import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationRequestsListComponent } from './accommodation-requests-list.component';

describe('AccommodationRequestsListComponent', () => {
  let component: AccommodationRequestsListComponent;
  let fixture: ComponentFixture<AccommodationRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccommodationRequestsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccommodationRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
