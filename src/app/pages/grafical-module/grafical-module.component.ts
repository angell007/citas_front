import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Response } from 'src/app/core/response.model';
import { ChartType } from './apex.model';
import {
  linewithDataChart, basicColumChart, columnlabelChart, lineColumAreaChart,
  basicRadialBarChart, simplePieChart, donutChart, barChart, splineAreaChart, dashedLineChart,
  statData, regionals
} from './data';
import { GraficalModuleService } from './grafical-module.service';


@Component({
  selector: 'app-grafical-module',
  templateUrl: './grafical-module.component.html',
  styleUrls: ['./grafical-module.component.scss']
})
export class GraficalModuleComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  linewithDataChart: ChartType;
  basicColumChart: ChartType;
  columnlabelChart: ChartType;
  lineColumAreaChart: ChartType;
  basicRadialBarChart: ChartType;
  simplePieChart: ChartType;
  donutChart: ChartType;
  barChart: ChartType;
  splineAreaChart: ChartType;
  dashedLineChart: ChartType;
  statData: any;
  regionals: any;

  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  hoveredDate: NgbDate;
  date: { year: number, month: number };
  selected: any;
  hidden: boolean = true;
  loading = false;
  fromDate: Date;
  toDate: Date;
  departments: any;
  specialities: any;
  department: any;
  regional: any;
  speciality: any;
  show: boolean = false;
  text: string = 'Graficar';
  disabled: boolean;

  constructor(private _graficalService: GraficalModuleService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Charts' }, { label: 'Apex charts', active: true }];
    this.getData()
    /**
     * Fethches the chart data
     */
    this._fetchData();
  }

  /**
   * Fetches the chart data
   */
  private _fetchData() {
    this.linewithDataChart = linewithDataChart;
    this.basicColumChart = basicColumChart;
    this.columnlabelChart = columnlabelChart;
    this.lineColumAreaChart = lineColumAreaChart;
    this.basicRadialBarChart = basicRadialBarChart;
    // this.simplePieChart = simplePieChart;
    this.donutChart = donutChart;
    this.barChart = barChart;
    this.splineAreaChart = splineAreaChart;
    this.dashedLineChart = dashedLineChart;
    // this.statData = statData;
    this.regionals = regionals;
  }

  /* Date */

  /**
  * @param date date obj
  */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
  * @param date date obj
  */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  /**
 * Is hovered over date
 * @param date date obj
 */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
 * on date selected
 * @param date date object
 */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && !date.before(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

      //this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
  }
  getData = () => {
    this._graficalService.getDepartments().subscribe((arg: Response) => this.departments = arg.data);
    this._graficalService.getSpecialities().subscribe((arg: Response) => this.specialities = arg.data);
  }

  graficar = () => {
    this.text = 'Graficando'
    this.disabled = true
    console.log(this.text);
    let params = {
      'regional': this.regional,
      'date': this.selected,
      'speciality': this.speciality,
      'department': this.department
    }
    this._graficalService.getDataByGrafical(params).subscribe((arg: Response) => {

      let seriesTT = [
        arg.data['Cita Primera Vez'], arg.data['Cita Control'],
        arg.data['Reasignaci??n de Citas'], arg.data['Cancelaci??n de Citas'],
        arg.data['Consulta Informaci??n Citas'], arg.data['Otro']
      ];

      let labelsTT = [
        'Cita Primera Vez', 'Cita Control',
        'Reasignaci??n de Citas', 'Cancelaci??n de Citas',
        'Consulta Informaci??n Citas', 'Otro'
      ];

      this.simplePieChart = {
        chart: {
          height: 320,
          type: 'pie',
        },
        series: seriesTT,
        labels: labelsTT,
        colors: ['#4aa3ff', '#ff3d60', '#1cbb8c', '#5664d2', '#fcb92c'],
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center',
          verticalAlign: 'middle',
          floating: false,
          fontSize: '14px',
          offsetX: 0,
          offsetY: -10
        },
        responsive: [{
          breakpoint: 600,
          options: {
            chart: {
              height: 240
            },
            legend: {
              show: false
            },
          }
        }]
      };

      this.statData = [
        {
          icon: 'ri-stack-line',
          title: 'Gesti??n total',
          value: arg.data.callcenter + arg.data.linea_de_frente
        }, {
          icon: 'ri-headphone-fill',
          title: 'Call center',
          value: arg.data.callcenter
        }, {
          icon: 'ri-map-pin-user-fill',
          title: 'Linea de frente ',
          value: arg.data.linea_de_frente
        }
      ];

      let seriesRe = [
        arg.data['regional_uno'], arg.data['regional_dos'],
      ];

      let labelsRe = [
        'Regional Uno', 'Regional Dos',
      ];

      this.donutChart = {
        chart: {
          height: 320,
          type: 'donut',
        },
        series: seriesRe,
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center',
          verticalAlign: 'middle',
          floating: false,
          fontSize: '14px',
          offsetX: 0,
          offsetY: -10
        },
        labels: labelsRe,
        colors: ['#1cbb8c', '#5664d2', '#fcb92c', '#4aa3ff', '#ff3d60'],
        responsive: [{
          breakpoint: 600,
          options: {
            chart: {
              height: 240
            },
            legend: {
              show: false
            },
          }
        }],
      };

      this.show = true;

    });

    this.text = 'Graficar'
    this.disabled = false

  }
}


