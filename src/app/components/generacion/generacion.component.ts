import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadersService } from 'src/app/services/loaders.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-generacion',
  templateUrl: './generacion.component.html',
  styleUrls: ['./generacion.component.css']
})
export class GeneracionComponent implements OnInit {

  sql: any;
  tablas = []
  esquemas = []
  cruds = [{ crud: 'INSERT' }, { crud: 'UPDATE' }, { crud: 'DELETE' }, { crud: 'GET' }]
  motores = [{ motor: "MSQL" }, { motor: 'Postgre' }]


  nuevoSchema = ''
  modal: NgbModalRef;
  inputDesactivado = false;
  forma: FormGroup;
  isChecked = false

  constructor(private fb: FormBuilder,
    private _loadersService: LoadersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _testService: TestService) {

    this.crearFormulario();
    this.cargarDataFormulario();
  }

  ngOnInit(): void {

    //this.getTablas();
    //this.getEsquemas();
  }

  //Validadores de los select
  get tablaNoValida() {
    return this.forma.get('tabla').invalid && this.forma.get('tabla').touched
  }

  get schemaNoValida() {
    return this.forma.get('schema').invalid && this.forma.get('schema').touched
  }

  get procedureNoValida() {
    return this.forma.get('procedure').invalid && this.forma.get('procedure').touched
  }

  get portNoValida() {
    return this.forma.get('port').invalid && this.forma.get('port').touched
  }

  get motorNoValida() {
    return this.forma.get('motor').invalid && this.forma.get('motor').touched
  }

  get passwordNoValida() {
    return this.forma.get('password').invalid && this.forma.get('password').touched
  }

  get userNoValida() {
    return this.forma.get('user').invalid && this.forma.get('user').touched
  }

  get databaseNoValida() {
    return this.forma.get('database').invalid && this.forma.get('database').touched
  }

  get serverNoValida() {
    return this.forma.get('server').invalid && this.forma.get('server').touched
  }





  crearFormulario() {
    this.forma = this.fb.group({
      ejecutar: [ this.isChecked ],
      server: [{ value: '' }, Validators.required],
      database: [{ value: '' }, Validators.required],
      user: [{ value: '' }, Validators.required],
      password: [{ value: ''}, Validators.required],
      motor: [{ value: '' }, Validators.required],
      port: [{ value: ''  }, Validators.required],
      tabla: [{ value: '', disabled: true }, Validators.required],
      procedure: [{ value: '', disabled: true }, Validators.required],
      schema: [{ value: '', disabled: true }, Validators.required],

    });
  }



  cargarDataFormulario() {

    this.forma.setValue({
      server: '',
      database: '',
      port: '',
      user: '',
      password: '',
      motor: '',
      tabla: '',
      procedure: '',
      schema: '',
      ejecutar: this.isChecked
    })
  }

  // onChange( motor ){

  //   this.getEsquemas( motor )

  // }

  validarConexion(  ) {
    console.log( this.forma.value );

    
    this._testService.testConection({
      database: this.forma.value['database'],
      user: this.forma.value['user'],
      server: this.forma.value['server'],
      port: this.forma.value['port'],
      password: this.forma.value['password'],
      motor: this.forma.value['motor']

    }).subscribe((response) => {

      if (!response) {

        this.toastr.error('No se pudo realizar la conexión al servidor, verifique los datos', '¡Error!');
        return;
      }
      
      this.inputDesactivado = !this.inputDesactivado; //Cambiar el estado de la variable
      this.toastr.success('Conectado con éxito', '¡Éxito!');


      this.getEsquemas(this.forma.value);
      this.forma.controls['procedure'].enable();

      if ( this.forma.value.motor === 'MSQL' ) { //Pasa únicamente para habilitar las tablas del MSQL
        this.forma.controls['tabla'].enable();
        this.forma.controls['schema'].enable();
        this.getTablas();
      }


    });
  }

  detenerConexion() {
    window.location.reload();
  }





  guardar( longContent ) {

    if (this.forma.invalid) {
      this.toastr.error("Existen campos vacíos", "¡Error!");

      return Object.values(this.forma.controls)
        .forEach(control => {
          control.markAllAsTouched();
        });

    } else {

      this.crearProcs();
    
      //Abro el modal donde me va a devolver el procedure para verlo
      if ( this.sql ){
        this.modalService.open(longContent, { scrollable: true });
      }      
    }
  }




  //El submid de los datos del crear esquema
  onSubmit(f: NgForm) {
    if (f.invalid) {
      this.toastr.error("Debe ingresar un nombre de esquema", "¡Error!");
      return;
    }

    //Despues de llamar al servicio
    this.crearEsquema( this.nuevoSchema );

    //Limpio el modal y lo cierro
    this.nuevoSchema = '';
    this.modal.close();
  }


  //Abrir el modal crear esquema
  modalSchema( modal2 ) {
    this.modal = this.modalService.open(modal2, { scrollable: true });
  }

  //Cerrar el modal crear esquema
  modalclose() {
    this.nuevoSchema = '';
    this.modal.close();
  }

  //Llamo el procedure de obtener tablas
  async getTablas() {
    await this._loadersService.getTablas().subscribe(res => {
      this.tablas = res;
    });

  }

  //Llamo el servicio de obtener esquema
  async getEsquemas(params) {
    console.log(params)
    await this._loadersService.getEsquemas(params).subscribe(res => {
      if (!res) {
        return;
      }
      this.esquemas = res;
      this.forma.controls['schema'].enable();



    })
  }

 

  //Llamo el servicio de crear esquema
  async crearEsquema( Nesquema ) {

    var existe = 0;

    this.esquemas.forEach(element => {
      if ( element.esquema == Nesquema ){
        existe = 1;
        this.toastr.error('Ya existe un esquema con este nombre')
        return;
      }
    });

    if ( existe === 0 ){
      
      this._loadersService.crearEsquema ( this.forma.value, Nesquema )
      .subscribe( response => {
        if ( response.status === 200 ){
          this.toastr.success('Esquema creado exitosamente', '¡Éxito!');
          this.esquemas.push( { esquema: Nesquema } )
          
        }else{
          this.toastr.warning('Ha ocurrido un error creando el esquema', '¡Vaya!')
        }
      }); 
    }
     
  }


  



  //Servicio para crear procedures automáticos
  async crearProcs() {
    await this._loadersService
      .crearProcedures(this.forma.value)
      .subscribe(response => {

        this.sql = response['code']

      })
  }

}
