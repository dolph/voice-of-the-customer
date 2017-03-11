import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any

@Component({
  selector: 'app-brand-perception',
  templateUrl: './brand-perception.component.html'
})
export class BrandPerceptionComponent implements OnInit {

  @Output() perceptionAnalysisOpen = new EventEmitter<any>();

  private dateType: string = 'last12months'
  private currentDateRange: string = 'Last 12 Months'
  private brandPerceptionOverTimeColumns = []

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
    this.discoveryService.getBrandPerceptionOverTime('positive', this.dateType).subscribe((response) => {
      // console.log(JSON.stringify(response))
      this.brandPerceptionOverTimeColumns = response
      var chart = c3.generate({
        bindto: '#brand-perception-chart',
        legend: {
          show: false
        },
        color: {
            pattern: ['#9855d4']
        },
        data: {
            x: 'Date',
            columns: this.brandPerceptionOverTimeColumns,
            onclick: function (d, element) {
              console.log(d)
              console.log(element)
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
    })
  }
}
