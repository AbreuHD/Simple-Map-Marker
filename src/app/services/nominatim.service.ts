import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NominationResponse } from '../interfaces/nominatim-response';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  constructor(private http: HttpClient) { }


  public getDataInfo(lat: number, long: number){
    return this.http.get<NominationResponse>('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + long);
  }
}
