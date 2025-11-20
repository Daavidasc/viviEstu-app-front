import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  @Input() images: string[] = [];
  currentImage: string = '';
  currentImageIndex = 0;

  ngOnInit() {
    if (this.images.length > 0) {
      this.currentImage = this.images[0];
    }
  }

  setImage(index: number) {
    this.currentImageIndex = index;
    this.currentImage = this.images[index];
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex > 0)
      ? this.currentImageIndex - 1
      : this.images.length - 1;
    this.setImage(this.currentImageIndex);
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex < this.images.length - 1)
      ? this.currentImageIndex + 1
      : 0;
    this.setImage(this.currentImageIndex);
  }
}
