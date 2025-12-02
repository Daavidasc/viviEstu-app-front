import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
    selector: 'app-google-maps',
    standalone: true,
    imports: [CommonModule, GoogleMapsModule],
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {
    @Input() center: google.maps.LatLngLiteral = { lat: -12.046374, lng: -77.042793 }; // Lima por defecto
    @Input() zoom = 13;
    @Input() markers: { position: google.maps.LatLngLiteral, title: string, description?: string }[] = [];

    mapOptions: google.maps.MapOptions = {
        mapId: 'DEMO_MAP_ID', // Requerido para marcadores avanzados en versiones recientes
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false
    };

    @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
    infoContent: { title: string, description?: string } | null = null;

    ngOnInit(): void { }

    openInfoWindow(markerElem: any, markerData: any, window: MapInfoWindow) {
        this.infoContent = {
            title: markerData.title,
            description: markerData.description
        };
        window.open(markerElem);
    }
}
