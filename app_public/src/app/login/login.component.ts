import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HistoryService } from '../services/history.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formError = '';

  public credentials = {
    name: '',
    email: '',
    password: '',
  };

  public pageContent = {
    header: {
      title: 'Create a new account',
      strapline: '',
    },
    sidebar: '',
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService
  ) {}

  public onLoginSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    this.authenticationService
      .login(this.credentials)
      .then(() =>
        this.router.navigateByUrl(this.historyService.getLastNonLoginUrl())
      )
      .catch((message) => (this.formError = message));
  }

  ngOnInit() {}
}
