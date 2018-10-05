import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { MapResizeDirective } from './directives/map-resize.directive';
import { LocationSearchComponent } from './src/app/components/location-search/location-search.component';
import { SearchboxComponent } from './components/searchbox/searchbox.component';
import { AppRoutingModule } from './/app-routing.module';
import { LocationComponent } from './components/location/location.component';
import { MapComponent } from './components/map/map.component';
import { PlacesComponent } from './components/places/places.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MapResizeDirective,
    LocationSearchComponent,
    SearchboxComponent,
    LocationComponent,
    MapComponent,
    PlacesComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey,
      libraries: ['places']
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
