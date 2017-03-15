import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../shared/discovery/discovery.service';

declare var c3:any
declare var $:any

@Component({
  selector: 'app-concepts-mentioned',
  templateUrl: './concepts-mentioned.component.html'
})
export class ConceptsMentionedComponent implements OnInit {

  @Input() product: string
  private dateType: string = 'last12months'
  private currentDateRange: string = 'Last 12 Months'
  private lengthOfCallsColumns = []

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
    this.discoveryService.getProductConceptsMentioned(this.dateType, this.product).subscribe((response) => {
      // console.log(JSON.stringify(response))
      var chart = c3.generate({
        bindto: '#concepts-mentioned-chart',
        legend: {
          show: false
        },
        color: {
          pattern: ['#35D6BB']
        },
        data: {
          x: 'Concept',
          columns: response,
          type: 'bar'
        },
        bar: {
          width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
          }
        },
        size: {
          height: 278
        },
        axis: {
            x: {
                type: 'category',
                categories: response[0]
            }
        }
      });
    })
  }

}
