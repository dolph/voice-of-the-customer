import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../shared/discovery/discovery.service';

declare var c3:any
declare var $:any

@Component({
  selector: 'app-perception-over-time',
  templateUrl: './perception-over-time.component.html'
})
export class PerceptionOverTimeComponent implements OnInit {

  @Input() product: string
  private dateType: string = 'last12months'
  private currentDateRange: string = 'Last 12 Months'
  private starterData = [["Date","2017-2-29"],["Count",10]]

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
    this.discoveryService.getProductPerceptionOverTime(this.dateType, this.product, 'negative').subscribe((response) => {
      this.renderChart(response)
    })
  }

  private renderChart(data) {
    console.log(JSON.stringify(data))
    var chart = c3.generate({
      bindto: '#perception-over-time-chart',
      legend: {
        show: false
      },
      color: {
        pattern: ['#DC267F']
      },
      data: {
        x: 'Date',
        columns: data,
        types: {
            Date: 'line'
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
      size: {
        height: 240
      }
    });
  }

}
