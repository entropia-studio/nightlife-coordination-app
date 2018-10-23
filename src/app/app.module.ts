import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';


import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { MapResizeDirective } from './directives/map-resize.directive';
import { SearchboxComponent } from './components/searchbox/searchbox.component';
import { AppRoutingModule } from './app-routing.module';
import { LocationComponent } from './components/location/location.component';
import { MapComponent } from './components/map/map.component';
import { PlacesComponent } from './components/places/places.component';
import { LoginComponent } from './components/login/login.component';

// ngx modules

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NavmenuComponent } from './components/navmenu/navmenu.component';
import { ModalContentComponent } from './components/modal-content/modal-content.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MapResizeDirective,    
    SearchboxComponent,
    LocationComponent,
    MapComponent,
    PlacesComponent,    
    LoginComponent,
    NavmenuComponent,
    ModalContentComponent,
    
    
  ],
  entryComponents: [LoginComponent, ModalContentComponent],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey,
      libraries: ['places']
    }),
    AppRoutingModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),   
    AngularFirestoreModule, 
    AngularFireAuthModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
