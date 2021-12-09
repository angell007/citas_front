import { Component, OnInit, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { CierrecontableService } from '../cierrecontable.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-modalcierrecontable',
  templateUrl: './modalcierrecontable.component.html',
  styleUrls: ['./modalcierrecontable.component.scss']
})
export class ModalcierrecontableComponent implements OnInit, OnDestroy {

  @ViewChild('ModalCierreContable') ModalCierreContable:any;
  @Input() abrirModal: Observable<any> = new Observable;
  @Output() recargarListas:EventEmitter<any> = new EventEmitter;
  private _suscription:any;
  public modelCierre:any = {
    Id_Cierre_Contable: '',
    Mes: '',
    Anio: '',
    Tipo_Cierre: '',
    Observaciones: ''
  };
  public meses:any = [];
  public Anio:any = new Date().getFullYear();
  public alertOption:SweetAlertOptions = {};

  constructor(
              private cierreContableService: CierrecontableService, 
              private swalService: SwalService,
              private http: HttpClient
    ) { 

      this.alertOption = {
        title: "¿Está Seguro?",
        text: "Se dispone a guardar el proceso de cierre",
        showCancelButton: true,
        cancelButtonText: "No, Dejame Comprobar!",
        confirmButtonText: 'Si, Guardar',
        showLoaderOnConfirm: true,
        focusCancel: true,
        // type: 'info',
        input: 'select',
        inputOptions: {
          Pcga: 'Imprimir en PCGA',
          Niif: 'Imprimir en NIIF'
        },
        preConfirm: (value) => {
          return new Promise((resolve) => {
            this.validarCierre(value)
          })
        },
        allowOutsideClick: () => !swal.isLoading()
      }
    }

  ngOnInit() {
    this._suscription = this.abrirModal.subscribe((data:any) => {
      this.modelCierre.Tipo_Cierre = data;
      this.ModalCierreContable.show();
    });

    this.getMeses();
  }

  ngOnDestroy() {
    if (this._suscription != null && this._suscription != undefined) {
      this._suscription.unsubscribe();
    }
  }

  private guardarCierre(datos, tipo) {
    this.http.post(environment.ruta+'php/contabilidad/cierres/guardar_cierre.php',datos).subscribe((data:any) => {
      if (data.nroId) {
        this.openComprobantesCierreAnio(data.nroId, tipo);
      }
      this.ModalCierreContable.hide();
      this.resetModel();
      this.swalService.ShowMessage(data);
      this.recargarListas.emit();
    })
  }

  private openComprobantesCierreAnio(id, tipo) {
    /* tipo = tipo == 'Pcga' ? '' : '&tipo_valor=Niif';
    window.open(this.generalService.Ruta_Principal+'php/contabilidad/cierres/movimientos_cierreanio_excel.php?id_registro='+id+'&id_funcionario_elabora='+this.Funcionario+tipo,'_blank');
    window.open(this.generalService.Ruta_Principal+'php/contabilidad/cierres/movimientos_cierreanio_excel.php?id_registro='+id+'&id_funcionario_elabora='+this.Funcionario+'&tipo_rep=act-pas'+tipo,'_blank'); */
  }

  validarCierre(tipo) {
    let info = this.cierreContableService.Utf8.encode(JSON.stringify(this.modelCierre));
    let datos = new FormData;
    datos.append('datos', info);

    this.http.post(environment.ruta+'php/contabilidad/cierres/validar_cierre.php',datos).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.guardarCierre(datos, tipo);
      } else {
        this.swalService.ShowMessage(data);
      }
    })
  }

  private resetModel() {
    this.modelCierre = {
      Id_Cierre_Contable: '',
      Mes: '',
      Anio: '',
      Tipo_Cierre: '',
      Observaciones: ''
    };
  }

  getMeses() {
    this.meses = this.cierreContableService.getMeses();
  }

}
