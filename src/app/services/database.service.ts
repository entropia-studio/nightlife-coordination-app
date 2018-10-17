import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Place } from '../interfaces/place';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  addToPlace(place: Place, user: User): Promise<any>{
    
    return;
  }

}
