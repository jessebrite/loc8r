import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  public pageContent = {
    header: {
      title: 'Page not found',
      strapline: ''
    },
    content: 'Sorry, but this page cannot be found'
  };

  ngOnInit() {
  }

}
