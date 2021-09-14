import { Component, OnInit } from '@angular/core';

import { personsList } from './data';
import { PersonService } from '../profesionales/profesionales.service';
import { Person } from 'src/app/core/models/person.model';
import { DependenciesService } from '../services/dependencies.service';


@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})

export class FuncionariosComponent implements OnInit {
  pagination = {
    pageSize: 12,
    page: 1,
    collectionSize: 0,
  }
  loading = false;
  breadCrumbItems: Array<{}>;
  people: Person[] = [];

  status: any[] = [
    { id: 1, name: 'Activo', selected: true },
    { id: 2, name: 'Suspendido', selected: true },
    { id: 3, name: 'Liquidado', selected: true },
  ];

  public dependencies: any = []

  public companies: any = [
    {
      id: 1,
      name: "HEMOPLIFE SALUD"
    },
    {
      id: 2,
      name: "MEGSALUD IPS"
    },
    {
      id: 3,
      name: "ECOMEDIS"
    },
    {
      id: 4,
      name: "VIDASER"
    },
    {
      id: 5,
      name: "MEDISERRANO"
    },
    {
      id: 6,
      name: "SALUD VITAL"
    },
    {
      id: 7,
      name: "MASCORP"
    },
    {
      id: 2,
      name: "INGBUS"
    },
    {
      id: 2,
      name: "INNOVATING"
    }
  ]
  isCollapsed: boolean;
  collapsed: boolean;
  collapsed3: boolean;

  // constructor(private _person: PersonService) {
  //   this.getPeople();
  // }

  constructor(private _person: PersonService, private _dependencies: DependenciesService) {
    this.getDependencies();

  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Product', active: true }];
    this.isCollapsed = false;
    this.collapsed = false;
    this.collapsed3 = false;
  }

  getDependencies() {
    this._dependencies.getDependencies().subscribe((r: any) => {
      this.dependencies = r.data
      this.dependencies = this.dependencies.map(r => {
        r.selected = true;
        return r
      })
      this.getPeople();
    })
  }


  getPeople(page = 1, name = '') {

    this.pagination.page = page;
    let params: any = { ...this.pagination }
    params.status = this.statusFilter();
    params.dependencies = this.dependenciesFilter();
    params.name = name ? name : ''

    this.loading = true;
    this._person.getPeople({ data: JSON.stringify(params) })
      .subscribe(d => {
        this.loading = false;
        this.people = d['data']['data']
        this.pagination.collectionSize = d['data']['total']
      })
  }


  statusFilter() {
    return this.status.reduce((acc: Array<any>, el) => el.selected == true ? acc.concat([el.name]) : acc, [])
  }
  dependenciesFilter() {
    return this.dependencies.reduce((acc: Array<any>, el) => el.selected == true ? acc.concat([el.value]) : acc, [])
  }
}
