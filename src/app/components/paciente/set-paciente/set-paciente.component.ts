import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { DataDinamicService } from 'src/app/data-dinamic.service';
import { dataCitaToAssignService } from 'src/app/pages/agendamiento/dataCitaToAssignService.service';
import { QueryPatient } from 'src/app/pages/agendamiento/query-patient.service';
import { genders, levels, typeRegimens, typeDocuments, epss } from './dataPacienteBurns';
import { Subscription } from 'rxjs';
import { Patient } from '../../../core/models/patient.model';
import Swal from 'sweetalert2';
import { OpenAgendaService } from '../../../pages/agendamiento/open-agenda.service';

@Component({
  selector: 'app-set-paciente',
  templateUrl: './set-paciente.component.html',
  styleUrls: ['./set-paciente.component.scss']
})


export class SetPacienteComponent implements OnInit {

  public genders = genders;
  public levels: any[];
  public typeRegimens: any[];
  public typeDocuments: any[];
  public eps: any[];
  loading = false;
  contracts: Array<any> = []

  paciente: any = new Patient();
  paciente2: any = {
    eps: { name: 'ECOOPSOS EPS SAS', value: 2 }
  }
  public currentPatient
  public departments: any[];
  public cities: any[];
  public agreements: any[];
  public companies: any[];
  public locations: any[];
  public show = false;
  public llamada: any;
  $qp: Subscription
  constructor(private _queryPatient: QueryPatient, private _dataDinamicService: DataDinamicService,
    private dataCitaToAssignService: dataCitaToAssignService,
    private _openAgenda: OpenAgendaService) {
    this.getEps();
  }

  ngOnInit() {

    this.$qp = this._queryPatient.patient.subscribe(async r => {

      if (r.paciente.identifier) {
        this.paciente = r.paciente
        this.llamada = r.llamada
        this.dataCitaToAssignService.dateCall = r
        await this.getDepartments();
        this.getTypeDocuments();
        this.getRegimens();
        this.getlevels();
        this.getCities();
        await this.getCompanies(r.paciente.municipality_id)
        r.paciente ? this.getContracts(r.paciente) : ''
      }
    })
  }

  async getDepartments() {
    await this._dataDinamicService.getDepartments().toPromise().then((req: any) => {
      this.departments = req.data
      this.departments.unshift({ text: 'Seleccione', value: '' })
    })
  }

  getCities() {
    if (this.paciente.department_id) {
      let parm = { department_id: this.paciente.department_id }
      this._dataDinamicService.getCities(parm).subscribe((req: any) => {
        this.cities = req.data
        this.cities.unshift({ text: 'Seleccione', value: '' })
      })
    }
  }

  async getCompanies(event) {
    await this._openAgenda.getIpsBasedOnCity(event).toPromise().then((req: any) => {
      this.companies = req.data
      this.companies.unshift({ text: 'Seleccione', value: '' })
      this.getLocations(this.paciente.company_id)
    })
  }

  clearSede() {
    this.locations = new Array
    this.paciente.location_id = ''
    this.locations.unshift({ text: 'Seleccione', value: '' })
  }

  getLocations(company_id) {

    if (!company_id || !this.companies) { return false; }
    const locations = this.companies.find(x => x.id === company_id)
    if (locations) { this.locations = locations.locations }
    if (this.paciente.location_id == '') { (this.paciente.location_id = this.locations[0].value) }

  }

  validateInfoPatient(formPatient: NgForm) {
    try {

      if (!formPatient.value.identifier || !formPatient.value.type_document_id || formPatient.value.type_document_id == '') {
        throw ({ title: 'Ha ocurrido un error', message: 'Debes Llenar Tipo Identificación e Identificación' });
      }

      const data = {
        identifier: formPatient.value.identifier,
        type_document: formPatient.value.type_document_id
      }

      this._queryPatient.validateInfoPatient(data).subscribe(async (req: any) => {
        if (req.code == 200 && req.data.id) {
          this.paciente = await req.data
          this.paciente.eps_id = Number(req.data.eps_id)
          this.paciente.level_id = Number(req.data.level_id)
          this.dataCitaToAssignService.dateCall['paciente'] = await req.data
          // this.paciente.isNew = false
          this._queryPatient.patient.next({ llamada: this.llamada, paciente: this.paciente })
          if (req.data.id) {
            this.show = true;
          }
        } else {
          Swal.fire('Advertencia', 'Paciente no encontrado en validador de derechos', 'warning');
          return false
        }
        this.loading = false;
      }, err => {
        throw ({ title: 'Ha ocurrido un error', message: 'Contáctese con el departamento de sistemas' });
      })


    } catch ({ title, message }) {
      this.loading = false;

      Swal.fire(title, message, 'error');

    }
  }

  getPatientAgain(document) {
    this._dataDinamicService.getPatientAgain(document).subscribe((req: any) => {
      let paciente = req.data;
      if (!paciente) {
        paciente = this.newPatient(paciente, document)
      }
      this._queryPatient.patient.next({ llamada: this.llamada, paciente: paciente });
    })
  }

  newPatient(paciente, document) {
    paciente = new Patient()
    paciente.identifier = document
    paciente.isNew = true
    return paciente;
  }

  getTypeDocuments() {
    this._dataDinamicService.getTypeDocuments().subscribe((req: any) => {
      this.typeDocuments = req.data
      this.typeDocuments.unshift({ text: 'Seleccione', value: '' })
    })
  }

  getEps() {
    this._dataDinamicService.getEps().subscribe((req: any) => {
      this.eps = req.data
      this.eps.unshift({ text: 'Seleccione', value: '' })
    })
  }

  getRegimens() {
    this._dataDinamicService.getRegimens().subscribe((req: any) => {
      this.typeRegimens = req.data
      this.typeRegimens.unshift({ text: 'Seleccione', value: '' })
    })
  }

  getlevels() {
    this._dataDinamicService.getlevels().subscribe((req: any) => {
      this.levels = req.data
      this.levels.unshift({ text: 'Seleccione', value: '' })
    })
  }

  getContracts(paciente) {

    const params = {
      'department_id': paciente.department_id,
      'company_id': paciente.company_id,
      'eps_id': paciente.eps_id,
      'regimen_id': paciente.regimen_id,
    }

    this._dataDinamicService.getContracts(params).subscribe((req: any) => {
      this.contracts = req.data
    })
  }

  save(formPatient: NgForm) {
    try {
      this.loading = true;

      formPatient.form.markAllAsTouched();

      if (formPatient.invalid) {
        this.loading = false;
        return false;
      }

      this._queryPatient.validate(this.paciente);

      this._dataDinamicService.savePatient(JSON.stringify(formPatient.value)).subscribe((req: any) => {
        if (req.code == 200) {
          this.dataCitaToAssignService.dateCall['paciente'] = req.data.patient
          this.paciente.id = req.data.patient.id;
          this.paciente.isNew = false
          this._queryPatient.patient.next({ llamada: this.llamada, paciente: this.paciente })

          this.show = true;
          Swal.fire('Felicidades', 'Actualizado correctamente', 'success');
        } else {

          throw ({ title: 'Ha ocurrido un error', message: 'Contáctese con el departamento de sistemas' });
        }

        this.loading = false;
      }, err => {
        throw ({ title: 'Ha ocurrido un error', message: 'Contáctese con el departamento de sistemas' });
        /*    Swal.fire('Ha ocurrido un error', 'Contáctese con el departamento de sistemas', 'error'); */
      })

    } catch ({ title, message }) {
      this.loading = false;

      Swal.fire(title, message, 'error');

    }


  }




  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //this._queryPatient.resetPatient();
    this.$qp.unsubscribe();
  }

}
