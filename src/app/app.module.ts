import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { MapResizeDirective } from './directives/map-resize.directive';
import { SearchboxComponent } from './components/searchbox/searchbox.component';
import { AppRoutingModule } from './/app-routing.module';
import { LocationComponent } from './components/location/location.component';
import { MapComponent } from './components/map/map.component';
import { PlacesComponent } from './components/places/places.component';
import { MarkerClickDirective } from './directives/marker-click.directive';
import { LoginComponent } from './components/login/login.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MapResizeDirective,    
    SearchboxComponent,
    LocationComponent,
    MapComponent,
    PlacesComponent,
    MarkerClickDirective,
    LoginComponent,    
  ],
  entryComponents: [LoginComponent],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey,
      libraries: ['places']
    }),
    AppRoutingModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
