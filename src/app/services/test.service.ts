import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private URL_BASE = 'http://localhost:3000/test/testing'

  constructor( private http: HttpClient ) { }

  testConection( params ): any { 
    return this.http.post(  `${ this.URL_BASE }`, params )
      .pipe( map( response =>  response['res']))
  }

}
