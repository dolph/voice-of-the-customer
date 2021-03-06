import { Component, OnInit } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any
declare var $:any

@Component({
  selector: 'app-length-of-calls',
  templateUrl: './length-of-calls.component.html'
})
export class LengthOfCallsComponent implements OnInit {

  private dateType: string = 'last14days'
  private currentDateRange: string = 'Last 14 Days'

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
    this.discoveryService.getCallsByDuration(this.dateType).subscribe((response) => {
      console.log(JSON.stringify(response))
      var chart = c3.generate({
        bindto: '#length-of-calls-chart',
        legend: {
          show: false
        },
        color: {
          pattern: ['#35D6BB']
        },
        data: {
          columns: [response[0]],
          type: 'bar'
        },
        bar: {
          width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
          }
        },
        axis: {
          x: {
            type: 'category',
            categories: response[1]
          }
        }
      });
    })
  }
}
