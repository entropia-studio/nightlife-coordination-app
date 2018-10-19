import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Place } from '../interfaces/place';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface addPlaceDbOb{
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

  getPlaces():Observable<any[]>{
    return this.http.get<any[]>('http://localhost:8080/api/data');
  }

  
  addToPlace(placeId: string, userId: string, locationId: string): Observable<addPlaceDbOb>{
    
    let addToPlace = {
      placeId: placeId,
      userId: userId,
      locationId: locationId,
      date: new Date()
    }
    console.log('addPlaceDbOb',addToPlace);
    return this.http.post<addPlaceDbOb>('http://localhost:8080/api/place/add',addToPlace,httpOptions);    
  }

}
