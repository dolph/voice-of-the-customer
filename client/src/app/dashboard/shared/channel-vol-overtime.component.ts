import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any

@Component({
  selector: 'app-channel-vol-overtime',
  templateUrl: './channel-vol-overtime.component.html'
})
export class ChannelVolOvertimeComponent implements OnInit {

  @Input() options: any
  private dateType: string = 'last14days'
  private currentDateRange: string = 'Last 14 Days'
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
    this.discoveryService.getVolumeOfOverTime(this.dateType, this.options.source).subscribe((response) => {
      this.renderChart(response)
    })
  }

  private renderChart(data) {
    console.log(JSON.stringify(data))
    var chart = c3.generate({
      bindto: '#channel-vol-over-time-chart',
      legend: {
        show: false
      },
      color: {
        pattern: ['#35D6BB']
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
      }
    });
  }
}
