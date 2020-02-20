import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeListComponent } from './home-list/home-list.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { LocationDetailsComponent } from './location-details/location-details.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home-list', pathMatch: 'full' },
  { path: '', component: HomepageComponent },
  { path: 'home-list', component: HomeListComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'locations', component: LocationDetailsComponent },
  { path: 'locations/:locationid', component: DetailsPageComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
