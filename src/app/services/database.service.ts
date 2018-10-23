import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface placeDbOb{
  _id?: string;
  placeId: string;
  userId: string;
  locationId: string;
  date?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  

  constructor(
    private http: HttpClient,
  ) { }

  getUrlApi = (): string => {
    var apiUrl = location.protocol + '//' + location.hostname;       
    return location.hostname == 'localhost' ? apiUrl + ':8080/api'  : apiUrl + '/api';
  }

  getPlaces():Observable<placeDbOb[]>{
    return this.http.get<placeDbOb[]>(this.getUrlApi() + '/data');
  }

  
  addToPlace(placeId: string, userId: string, locationId: string): Observable<placeDbOb>{
    
    let addToPlace = {
      placeId: placeId,
      userId: userId,
      locationId: locationId,
      date: new Date()
    }
    
    return this.http.post<placeDbOb>(this.getUrlApi() + '/meeting/add',addToPlace,httpOptions);    
  }

  removeToPlace(id: string): Observable<placeDbOb>{         
    return this.http.delete<placeDbOb>(this.getUrlApi() + '/meeting/delete/'+id,httpOptions);    
  }

}
