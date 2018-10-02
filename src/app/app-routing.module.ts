import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './components/location/location.component';
import { PlacesComponent } from './components/places/places.component';

const routes: Routes = [
  { path: '', component: LocationComponent },
  { path: 'places', component: PlacesComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
