import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from '../services/loc8r-data.service';
import { GeolocationService } from '../services/geolocation.service';
import { Location } from '../location';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {

  // pagination variables
  pager = {};
  pageOfItems = [];

  apiBaseUrl = environment.apiBaseUrl;

  constructor(private loc8rDataService: Loc8rDataService,
              private geolocationService: GeolocationService,
              private http: HttpClient) { }

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


  // Pagination
  public loadPage(locationid) {
    // get page of items from api
    this.http.get<any>(`${this.apiBaseUrl}/locations/?location=${locationid}`).subscribe(x => {
        this.pager = x.locationdid;
        this.pageOfItems = x.pageOfItems;
    });
}

  ngOnInit() {
    this.getPosition();
  }

}
