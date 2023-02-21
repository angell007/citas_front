import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { dataCitaToAssign } from 'src/app/core/interfaces/dataCitaToAssign.model';
import { AssingService } from 'src/app/services/assign.service';
import { dataCitaToAssignService } from '../../dataCitaToAssignService.service';
import { OpenAgendaService } from '../../open-agenda.service';
import { QueryAvailabilitySpacesService } from '../../query-availability-spaces.service';
import { QueryPatient } from '../../query-patient.service';
import { AsignarCalendarioComponent } from '../agendar-citas-panel/asignar-calendario/asignar-calendario.component';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit {

  public dataCitaToAssign = new dataCitaToAssign();
  public type_appointments: [];
  public regimeIdFromService: any;
  public contratcIdFromService: any;
  public specialties: [];
  public infowailist: any
  public persons: any[];
  public ipss: [];
  public sedes: [];
  public type_subappointments: [
    {
      value: any
    }
  ];

  @Output('siguiente') sigx = new EventEmitter();
  // @ViewChild(AsignarCalendarioComponent) calendar: AsignarCalendarioComponent;

  constructor
    (private _openAgendaService: OpenAgendaService,
      public _queryAvailabilitySpacesService: QueryAvailabilitySpacesService,
      private dataCitaToAssignService: dataCitaToAssignService,
      private _queryPatient: QueryPatient,
      private _assingService: AssingService
    ) { }

  ngOnInit(): void {

    this.getTypeAppointment();

    this._queryPatient.infowailist.subscribe(res => {

      if (res.anotherData) {
        this.infowailist = res.anotherData
        this.dataCitaToAssign.speciality = this.infowailist.speciality_id
        this.dataCitaToAssign.person = this.infowailist.profesional_id
        this.dataCitaToAssign.appointmentId = this.infowailist.type_appointment_id
        this.dataCitaToAssign.subappointmentId = this.infowailist.sub_type_appointment_id
        this.dataCitaToAssign.currentAppointment = this.infowailist.appointment_id
        this.getSubTypeAppointmentWailist();
      } else {
        this.reset();
      }

    })

    this._assingService.dataChangeRegime.subscribe((data) => {
      this.regimeIdFromService = data;
    })

    this._assingService.dataChangeContract.subscribe((data) => {
      this.contratcIdFromService = data;
    })

  }


  dispatchPerson(form: NgForm) {
    if (form.valid) {
      this._queryAvailabilitySpacesService.getPerson.next({ person: this.dataCitaToAssign.person, params: form.value });

    } else {
      this._queryAvailabilitySpacesService.getPerson.next({ person: 0, params: form.value })
    }
  }

  dispatchSpeciality(s) {
    this.dataCitaToAssign.person = ''
    /* this._queryAvailabilitySpacesService.getspeciality.next(speciality); */
    /*  this._queryAvailabilitySpacesService.getPerson.next({person:0,params:0}); */
  }

  getTypeAppointment() {
    this._openAgendaService.getTypeAppointment(this.dataCitaToAssign.appointment.text).subscribe((resp: any) => {
      this.type_appointments = resp.data;
    });
  }

  getSubTypeAppointment(form: NgForm) {
    this.dataCitaToAssign.appointment = this.searchAppointment(this.type_appointments, this.dataCitaToAssign.appointmentId);
    this._openAgendaService.getSubTypeAppointment(this.dataCitaToAssign.appointment.value).subscribe((resp: any) => {
      this.type_subappointments = resp.data;
      this.dataCitaToAssign.subappointmentId = this.type_subappointments[0].value
      if (this.dataCitaToAssign.appointment.face_to_face) {
        this.getIps()
      }
      this.getSpecialties()
      this.dispatchPerson(form)
    });

  }

  getSubTypeAppointmentWailist() {
    this._openAgendaService.getSubTypeAppointment(this.dataCitaToAssign.appointmentId).subscribe((resp: any) => {
      this.type_subappointments = resp.data;
      this.dataCitaToAssign.subappointmentId = this.type_subappointments[0].value
      if (this.dataCitaToAssign.appointment.face_to_face) {
        this.getIps()
      }
      this.getSpecialties()
      this.getProfesionals()
      //TODO:Implementar dispacth
      // this.dispatchPerson(form)
    });

  }

  getIps() {
    this.dataCitaToAssign.subappointment = this.searchItem(this.type_subappointments, this.dataCitaToAssign.subappointmentId);
    this._openAgendaService.getIps('3').subscribe((resp: any) => {
      this.ipss = resp.data;
    });
  }

  getSedes() {
    this.dataCitaToAssign.ips = this.searchItem(this.ipss, this.dataCitaToAssign.ipsId);
    this._openAgendaService.getSedes(this.dataCitaToAssign.ips.value, this.dataCitaToAssign.subappointment.procedure).subscribe((resp: any) => {
      this.sedes = resp.data;
    });
  }

  getSpecialties() {
    this._openAgendaService.getSpecialties(String(this.dataCitaToAssign.sede), this.dataCitaToAssign.subappointment.procedure).subscribe((resp: any) => {
      this.specialties = resp.data;
    });
  }

  getProfesionals() {

    let params = {
      'regimen_id': this.regimeIdFromService,
      'contract_id': this.contratcIdFromService
    }

    this._openAgendaService.getProfesionals(this.dataCitaToAssign.ips.value, String(this.dataCitaToAssign.speciality), params).subscribe((resp: any) => {
      this.persons = resp.data;
      this.persons.unshift({ value: '', text: 'Todos' })
    });
  }


  searchItem(data, value) {
    return data.find((item) => item.value === value);
  }

  searchAppointment(data, value) {
    return data.find((item) => item.value === value);
  }


  reset() {
    this.dataCitaToAssign = new dataCitaToAssign;
  }

  siguiente() {
    this.dataCitaToAssignService.dataCitaToAssign.next(this.dataCitaToAssign);
    this.sigx.emit('');
  }

}
