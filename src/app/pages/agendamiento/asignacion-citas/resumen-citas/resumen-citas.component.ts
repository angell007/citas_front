import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen-citas',
  templateUrl: './resumen-citas.component.html',
  styleUrls: ['./resumen-citas.component.scss']
})
export class ResumenCitasComponent implements OnInit {
  data: any = {
    Id_Especialidad: '',
  }
  typesDocuments: Array<any> = [
    { Nombre: 'CI', Id: '1' },
    { Nombre: 'CC', Id: '2' },
    { Nombre: 'CC', Id: '2' },
  ]
  citas: any = [
    { Id_Cita: '1', Estado: 'Activa', Descripcion: 'Cita trauma Cita trauma Cita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita trauma', Especialidad: 'Traumatólogo', Fecha: '2018-09-28 17:21:21' },
    { Id_Cita: '1', Estado: 'Activa', Descripcion: 'Cita trauma Cita trauma Cita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita trauma', Especialidad: 'Traumatólogo', Fecha: '2018-09-28 17:21:21' },
    { Id_Cita: '1', Estado: 'Activa', Descripcion: 'Cita trauma Cita trauma Cita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita traumaCita trauma Cita trauma', Especialidad: 'Traumatólogo', Fecha: '2018-09-28 17:21:21' },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
