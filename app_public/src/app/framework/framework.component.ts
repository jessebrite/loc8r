import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HistoryService } from '../services/history.service';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.css']
})
export class FrameworkComponent implements OnInit {
  navbarOpen = false;

  constructor(private authenticationService: AuthenticationService,
              private historyService: HistoryService) { }

  date = new Date().getFullYear();

  public doLogout(): void {
    this.authenticationService.logout();
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isloggedIn();
  }

  public getUsername(): string {
    const user = this.authenticationService.getCurrentUser();
    return user ? user.name : 'Guest';
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  ngOnInit() {
  }

}
