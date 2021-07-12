import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TipificationData } from 'src/app/core/models/typificationData.model';
import { TipificationService } from 'src/app/core/services/tipification.service';
import { QueryPatient } from '../../query-patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tipificacion',
  templateUrl: './tipificacion.component.html',
  styleUrls: ['./tipificacion.component.scss'],
})
export class TipificacionComponent implements OnInit {
  //@Output('tramite') tramite = new EventEmitter();
  @Input() tramitex: any;
  data: any = {
    Id_Llamada: '',
    Id_Funcionario: '',
    Fecha: '',
    Id_Paciente: '',
    Id_Tramite: 1,
    Id_Ambito: '',
    Id_Tipo_Servicio: '',
    Id_Tipificacion: '',
  };
  tramiteSelected = {
    name: '',
    id: '',
    component: '',
    hasTypeServices: 0,
    hasAmbits: 0
  };

 
  formalities: any = [];
  ambits: any = [];
  typeServices: any = [];
  public obsPatient:Subscription;
  constructor(
    private _qp: QueryPatient,
    private _tipification: TipificationService
  ) {
    this.obsPatient = _qp.patient.subscribe((r) => {
      if (r.llamada.Tipo_Tramite) {
        this.data.Id_Tramite = r.llamada.Tipo_Tramite;
        this.data.Id_Ambito = r.llamada.Ambito;
        this.data.Id_Tipo_Servicio = r.llamada.Tipo_Servicio;
        console.log(r.llamada, 'llamada');
      }
      this.getFormalities();
      this.getAmbits();
    });
  }

  getFormalities() {
    this._tipification.getFormalities().subscribe((r: any) => {
      this.formalities = r.data;
      this.tramiteWasChanged();
    });
  }

  getTypeServices() {
    this._tipification.getTypeServices(this.data.Id_Tramite).subscribe((r: any) => {
      this.typeServices = r.data;
    });
  }
  getAmbits() {
    this._tipification.getAmbits().subscribe((r: any) => {
      this.ambits = r.data;
    });
  }
  ngOnInit(): void { }

  tramiteWasChanged() {
    this.getTypeServices();

    //if (this.data.Tipo_Tramite) {

    this.tramiteSelected = this.formalities.find((e) => e.id == this.data.Id_Tramite);
    console.log(this.tramiteSelected, 'tr');


    /*   this.data.Id_Ambito =

      tramite.hasAmbits  ? this.data.Id_Ambito  : '' ;
    this.data.Id_Tipo_Servicio =
      tramite.hasTypeServices ? this.data.Id_Tipo_Servicio : ''; */
    //this.tramite.emit(tramite)

    console.log(this.data, 'chnges');

    this.changes()
    this._qp.tramiteSelected.next(this.tramiteSelected);

    //}

  }

  format() {
    this.data.Id_Ambito = '';
    this.data.Id_Tipo_Servicio = '';
  }


  changes() {
    let d = new TipificationData(this.data.Id_Ambito, this.data.Id_Tramite, this.data.Id_Tipo_Servicio)
    this._qp.tipificationData.next(d);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.obsPatient.unsubscribe();
  }
  
}
