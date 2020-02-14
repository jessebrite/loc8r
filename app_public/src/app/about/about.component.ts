import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  public pageContent = {
    header: {
      title: 'About Loc8r',
      strapline: '',
    },
    content: 'Loc8r was created to help people find places to sit ' +
      'down and get a bit of work done.\n\nLorem ipsum dolor sit ' +
      'amet, consectetur adipiscing elit. The pipe itself is fairly ' +
      'straightforward. It needs to accept incoming text as a string ' +
      'value. Replace each \n with a, and then return a string value. ' +
      'Update the main content of html-line-breaks.html to look like the following snippet'
  };
  ngOnInit() {
  }

}
