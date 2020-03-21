import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public pageContent = {
    header: {
      title: 'Contact',
      strapline: ''
    },
    content: 'Contact will be provided soon'
  };

  constructor() { }

  ngOnInit() {
  }

}
