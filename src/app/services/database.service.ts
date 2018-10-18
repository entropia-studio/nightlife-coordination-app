import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Place } from '../interfaces/place';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  
  addToPlace(place: Place, user: User): Promise<any>{
    
    return;
  }

}
