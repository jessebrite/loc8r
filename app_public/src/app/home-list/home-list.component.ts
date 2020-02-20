import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from '../loc8r-data.service';
import { GeolocationService } from '../geolocation.service';

export class Location {
  // tslint:disable-next-line: variable-name
  _id: string;
  name: string;
  distance: number;
  address: string;
  rating: number;
  coords: number[];
  facilities: string[];
  reviews: any[];
  openingTimes: any[];
}

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {

  constructor(private loc8rDataService: Loc8rDataService,
              private geolocationService: GeolocationService) { }

  locations: Location[] = [];

  public message: string;

  private getLocations(position: any): void {
    this.message = 'Searching for nearby places';
    const lat: number = position.coords.latitude;
    const lng: number = position.coords.longitude;
    this.loc8rDataService
      .getLocations(lat, lng)
        .then(foundLocations => this.locations = foundLocations);
  }

  private getPosition(): void {
    this.message = 'Getting your location...';
    this.geolocationService.getPosition(
      this.getLocations.bind(this),
      this.showError.bind(this),
      this.noGeo.bind(this));
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
