import { Component, OnInit } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any
declare var $:any

@Component({
  selector: 'app-vol-calls-over-time',
  templateUrl: './vol-calls-over-time.component.html'
})
export class VolCallsOverTimeComponent implements OnInit {

  private dateType: string = 'last12months'
  private currentDateRange: string = 'Last 12 Months'
  private callVolumeOverTimeColumns = []

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadChart()
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
    this.loadChart()
  }

  private loadChart() {
    let self = this
    this.discoveryService.getVolumeOfCallsOverTime(this.dateType).subscribe((response) => {
      //console.log(JSON.stringify(response))
      this.callVolumeOverTimeColumns = response
      var chart = c3.generate({
        bindto: '#vol-calls-over-time-chart',
        legend: {
          show: false
        },
        color: {
          pattern: ['#35D6BB']
        },
        data: {
          x: 'Date',
          columns: response,
          types: {
              Date: 'area',
              Count: 'area-spline'
          }
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d'
            }
          }
        }
      });
    })
  }
}
