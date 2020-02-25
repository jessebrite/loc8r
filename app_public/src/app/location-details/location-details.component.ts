import { Component, OnInit, Input } from '@angular/core';
import { Location, Review } from '../location';
import { Loc8rDataService } from '../loc8r-data.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;

  public BINGMAPS_API_KEY = 'AoD8HJqoeVQM1GmIOeJSTgsJ7jVNsriUgXvWDXh6xbofHvj6egAI6TQc3Yv1l6Vf';

  constructor(private loc8rDataService: Loc8rDataService) { }

  public formVisible = false;
  public formError: string;

  public newReview: Review = {
    author: '',
    rating: 5,
    reviewText: ''
  };

  private formIsValid(): boolean {
    if (this.newReview.author && this.newReview.rating && this.newReview.reviewText) {
      return true;
    } else {
      return false;
    }
  }

  private resetAndHideReviewforms(): void {
    this.formVisible = false;
    this.newReview.author = '';
    this.newReview.rating = 5;
    this.newReview.reviewText = '';
  }

  public onReviewSubmit(): void {
    this.formError = '';
    if (this.formIsValid()) {
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
      .then((review: Review) => {
        console.log('review saved', review);
        console.log(this.newReview);
        const reviews = this.location.reviews.slice(0);
        reviews.unshift(review);
        this.location.reviews = reviews;
        this.resetAndHideReviewforms();
      });
    } else {
      this.formError = 'All fields are required, please try again';
    }
  }

  ngOnInit() {
  }

}