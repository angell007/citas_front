import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatosBasicosEmpresaComponent } from './configuracion-empresa/datos-basicos-empresa/datos-basicos-empresa.component';
import { DatosPagoComponent } from './configuracion-empresa/datos-pago/datos-pago.component';
import { DatosNominaComponent } from './configuracion-empresa/datos-nomina/datos-nomina.component';
import { ConfiguracionEmpresaComponent } from './configuracion-empresa/configuracion-empresa.component';
import { DatosPilaComponent } from './configuracion-empresa/datos-pila/datos-pila.component';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CamposTercerosComponent } from './campos-terceros/campos-terceros.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { NominaComponent } from './nomina/nomina.component';
import { HorasExtrasConfigComponent } from './nomina/components/horas-extras-config/horas-extras-config.component';
import { SSocialFuncionarioConfigComponent } from './nomina/components/s-social-funcionario-config/s-social-funcionario-config.component';
import { SSocialEmpresaConfigComponent } from './nomina/components/s-social-empresa-config/s-social-empresa-config.component';
import { RiesgoArlConfigComponent } from './nomina/components/riesgo-arl-config/riesgo-arl-config.component';
import { ParafiscalesConfigComponent } from './nomina/components/parafiscales-config/parafiscales-config.component';
import { IncapacidadesConfigComponent } from './nomina/components/incapacidades-config/incapacidades-config.component';
import { FormatoHistoriaComponent } from './formato-historia/formato-historia.component';

@NgModule({
  declarations: [
    ConfiguracionEmpresaComponent,
    DatosNominaComponent,
    DatosPagoComponent,
    DatosPilaComponent,
    DatosBasicosEmpresaComponent,
    CamposTercerosComponent,
    NominaComponent,
    HorasExtrasConfigComponent,
    SSocialFuncionarioConfigComponent,
    SSocialEmpresaConfigComponent,
    RiesgoArlConfigComponent,
    ParafiscalesConfigComponent,
    IncapacidadesConfigComponent,
    FormatoHistoriaComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    ComponentsModule,
    FormsModule,
    ConfiguracionRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    PipesModule
  ]
})
export class ConfiguracionModule { }
