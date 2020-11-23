import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators" //Maping


@Injectable({
  providedIn: 'root'
})
export class LoadersService {



  //Servicios que se comunican con el servidor
  
  private URL_BASE = 'http://localhost:3000'

  
  constructor( private http: HttpClient ) { }

  getTablas()  {
    
    return this.http.get( `${ this.URL_BASE }/tables/getTablas` )
      .pipe( map ( response => response['data'] ) );  
  
  }

  getEsquemas ( param ) {
    console.log('service')
    return this.http.get( `${this.URL_BASE}/schema/getEsquemas?motor=${ param.motor }&database=${ param.database }&port=${ param.port }&server=${ param.server }&user=${param.user}&password=${ param.password }`)
       .pipe( map ( response => response['data'] ));

  }

  crearEsquema ( params, esquemaNuevo ) {

    params['nuevoEsquema'] = esquemaNuevo;
    console.log('Creando esquema')
    return this.http.post(`${this.URL_BASE}/schema/genEsquema`, params, {observe: "response"});
    
  }

  crearProcedures ( params ) {
    let accion;
    switch ( params.procedure ) {
      case 'INSERT':
        accion = 'genInsert';
        break;

      case 'UPDATE':
        accion = 'genUpdate';
        break;
      
      case 'GET':
        accion = 'genGets';
        break;

      default:
        accion = 'genDelete';
        break;
    }


    return this.http.get(`${this.URL_BASE}/generate/${ accion }?motor=${ params.motor }&database=${ params.database }&port=${ params.port }&server=${ params.server }&user=${ params.user }&password=${ params.password }&esquema=${ params.schema }&tabla=${ params.tabla }&ejecutar=${ params.ejecutar }`)
    .pipe(map(response => response ));
  }

}

