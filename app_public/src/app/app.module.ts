import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeListComponent } from './home-list/home-list.component';
import { DistancePipe } from './pipes/distance.pipe';
import { HttpClientModule } from '@angular/common/http';
import { FrameworkComponent } from './framework/framework.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HtmlLineBreaksPipe } from './pipes/html-line-breaks.pipe';
import { RatingStarsComponent } from './rating-stars/rating-stars.component';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { MostRecentFirstPipe } from './pipes/most-recent-first.pipe';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
// import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    AboutComponent,
    ContactComponent,
    FrameworkComponent,
    HomeListComponent,
    PageNotFoundComponent,
    DistancePipe,
    HomepageComponent,
    PageHeaderComponent,
    SidebarComponent,
    HtmlLineBreaksPipe,
    RatingStarsComponent,
    LocationDetailsComponent,
    DetailsPageComponent,
    MostRecentFirstPipe,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    // {provide: APP_BASE_HREF, useValue : '/' }
  ],
  bootstrap: [FrameworkComponent]
})
export class AppModule {}
