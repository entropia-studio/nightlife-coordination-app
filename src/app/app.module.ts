import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { MapResizeDirective } from './directives/map-resize.directive';
import { LocationSearchComponent } from './src/app/components/location-search/location-search.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MapResizeDirective,
    LocationSearchComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey,
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
