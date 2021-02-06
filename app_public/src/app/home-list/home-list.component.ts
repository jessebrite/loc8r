import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from '../services/loc8r-data.service';
import { GeolocationService } from '../services/geolocation.service';
import { Location } from '../location';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css'],
})
export class HomeListComponent implements OnInit {
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private loc8rDataService: Loc8rDataService,
    private geolocationService: GeolocationService
  ) {}

  locations: Location[] = [];
  total: number; // # of records
  pageNo = 1; // # of pages
  data: any;
  itemsPerPage = 6;

  public message: string;

  private getLocations(position: any): void {
    this.message = 'Searching for nearby places';
    const lat: number = position.coords.latitude;
    const lng: number = position.coords.longitude;
    this.loc8rDataService.getLocations(lat, lng).then((foundLocations) => {
      // console.log(`Locations: ${foundLocations}`);
      this.locations = foundLocations['locations'];
      this.total = foundLocations['total'];
      this.pageNo = foundLocations['pageNo'];
      this.data = foundLocations;
      this.message = '';
    });
  }

  private getPosition(): void {
    this.message = 'Getting your location...';
    this.geolocationService.getPosition(
      this.getLocations.bind(this),
      this.showError.bind(this),
      this.noGeo.bind(this)
    );
  }

  private showError(error: any): void {
    this.message = error.message;
  }

  private noGeo(error: any): void {
    this.message = 'Geolocation not supported on this browser';
  }

  ngOnInit() {
    this.getPosition();
  }
}
