import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any
declare var $:any

@Component({
  selector: 'app-brand-perception',
  templateUrl: './brand-perception.component.html'
})
export class BrandPerceptionComponent implements OnInit {

  @Output() perceptionAnalysisOpen = new EventEmitter<any>();

  private chartAvailable = false
  private dateType: string = 'last14days'
  private currentDateRange: string = 'Last 14 Days'
  private starterData = [["Date","2017-2-29"],["Percentage",10]]

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
    this.renderChart(this.starterData)
  }

  ngAfterViewInit() {
    this.retrieveData()
  }

  private setDateType(value) {
    this.dateType = value
    switch (value) {
      case 'last12months':
        this.currentDateRange = 'Last 12 Months'
        break
      case 'thisyear':
        this.currentDateRange = 'This Year'
        break
      case 'thismonth':
        this.currentDateRange = 'This Month'
        break
      case 'last4weeks':
        this.currentDateRange = 'Last 4 Weeks'
        break
      case 'last14days':
        this.currentDateRange = 'Last 14 Days'
        break
    }
    this.retrieveData()
  }

  private retrieveData() {
    this.discoveryService.getBrandPerceptionOverTime('positive', this.dateType).subscribe((response) => {
      this.renderChart(response)
    })
  }

  private renderChart(data) {
    let self = this
    this.chartAvailable = true
    var chart = c3.generate({
      bindto: '#brand-perception-chart',
      legend: {
        show: false
      },
      color: {
          pattern: ['#35D6BB']
      },
      data: {
          x: 'Date',
          columns: data,
          onclick: function (d, element) {
            d.cx = Math.round($(element).attr('cx'))
            self.perceptionAnalysisOpen.emit(d);
          }
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d'
              }
          }
      },
      grid: {
        y: {
            lines: [
                {value: 20, text: '20', class: 'y-grid-line'},
                {value: 40, text: '40', class: 'y-grid-line'},
                {value: 60, text: '60', class: 'y-grid-line'},
                {value: 80, text: '80', class: 'y-grid-line'},
                {value: 100, text: '100', class: 'y-grid-line'}
            ]
        }
      }
    });
  }
}
