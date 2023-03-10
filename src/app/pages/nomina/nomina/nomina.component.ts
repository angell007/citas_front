import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PayRollService } from './pay-roll.service';
import { CompanyService } from '../../ajustes/informacion-base/services/company.service';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
})
export class NominaComponent implements OnInit {
  nomina: any = {
    frecuencia_pago: 30,
  };
  loadingPeople = false;
  pago: any = {};
  renderizar = false;
  funcionarios = [];
  funcionariosBase = [];
  people = [];
  companies: any[] = [];

  inicioParemeter:string;
  finParemeter: string;
  companyId : number;

  constructor(
    private _payroll: PayRollService,
    private _people: PersonService,
    public config: NgbDropdownConfig,
    private _swal: SwalService,
    private route: ActivatedRoute,
    private _company: CompanyService,
    private router:Router
  ) {
    config.placement = 'left';
    config.placement = 'left-bottom';
  }

  async ngOnInit() {
    await this.getCompanies();
    const params = this.route.snapshot.queryParams;
    if (Object.keys(params).length) {
      this.inicioParemeter = params.inicio;
      this.finParemeter = params.fin;
      this.companyId = Number( params.company_id) 
    }
    console.log(Number( this.companyId ))
    this.getPagoNomina();
    this.getPeople();
  }

  async getCompanies() {
    await this._company
      .getCompanies({ owner: 1 })
      .toPromise()
      .then((d: any) => {
        this.companies = d.data;
        d.data[0] ? (this.companyId = d.data[0].value) : '';
      });
  }

  getPagoNomina() {
    this.loadingPeople = true;
    const params: any =
      this.inicioParemeter && this.finParemeter
        ? {
            date1: this.inicioParemeter,
            date2: this.finParemeter,
          }
        : {};
    params.companyId = this.companyId;
    console.log(params);

    this._payroll.getPayrollPays(params).subscribe((r: any) => {
      this.nomina = r.data;
      this.pago.id = this.nomina.nomina_paga_id
        ? this.nomina.nomina_paga_id
        : '';

      this.getFuncionarios(r.data.funcionarios);
      this.getUsuario();
      this.loadingPeople = false;
    });
  }
  getUsuario() {
    this.pago.admin_id = 1;
  }

  getFuncionarios(data) {
    this.funcionarios = data;
    this.funcionariosBase = data;
    this.renderizar = true;
  }

  filter(event) {
    if (event) {
      let fun = this.funcionariosBase.find((r) => r.id == event);
      this.funcionarios = fun ? [fun] : [];
    } else {
      this.funcionarios = this.funcionariosBase;
    }
  }

  getPeople() {
    this._people.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: '' });
    });
  }

  get inicioPeriodo() {
    return this.nomina.inicio_periodo
      ? moment(this.nomina.inicio_periodo).format('DD/MM/YYYY')
      : '';
  }
  get finPeriodo() {
    return this.nomina.fin_periodo
      ? moment(this.nomina.fin_periodo).format('DD/MM/YYYY')
      : '';
  }

  cargarDatosFuncionarios(fechaInicio, fechaFin) {
    this._payroll.getPeoplePayroll().subscribe((r: any) => {
      this.nomina = r.data;
    });
  }

  deletePagoNomina() {
    this._payroll.deletePayroll().subscribe(
      (r) => {},
      (err) => {}
    );
  }

  emitElectronic() {
    this._swal
      .show({
        title: 'Reporte de n??mina electr??nica',
        text: '??Est?? seguro de emitir esta n??mina?',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._payroll
            .reporElectronic(this.nomina.nomina.id)
            .subscribe((r) => {});
        }
      });
  }
  showInterfaceForGlobo(modal) {}

  mostrarNovedades(fun) {}
  mostrarIngresosP(fun) {}
  mostrarIngresosNP(fun) {}
  mostrarDeducciones(fun) {}
  getColilla(fun) {}

  postPagoNomina() {
    this.pago.start_period = this.nomina.inicio_periodo;
    this.pago.end_period = this.nomina.fin_periodo;
    this.pago.total_salaries = this.nomina.salarios;
    this.pago.total_retentions = this.nomina.retenciones;
    this.pago.total_provisions = this.nomina.provisiones;
    this.pago.total_social_secturity = this.nomina.seguridad_social;
    this.pago.total_parafiscals = this.nomina.parafiscales;
    this.pago.total_overtimes_surcharges = this.nomina.extras;
    this.pago.total_incomes = this.nomina.ingresos;
    this.pago.total_cost = this.nomina.costo_total_empresa;

    this._swal
      .show(
        {
          title: '??Est?? seguro?',
          text: 'Se dispone a generar una n??mina, revise que todo coincida antes de continuar.',
          icon: 'warning',
        },
        this.savePayroll
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.renderizar = false;
        }
      });
  }

  savePayroll = async () => {
    let body = {...this.pago, company_id:this.companyId}
    await this._payroll
      .savePayroll(body)
      .toPromise()
      .then((r: any) => {
        this._swal.show({
          title: 'Operaci??n exitosa',
          text: 'N??mina Guardada correctamente',
          icon: 'success',
	  showCancel:false
        });
	this.router.navigate(['/nomina/historial-pagos'])
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
}
