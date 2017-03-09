import { Component, OnInit } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any

@Component({
  selector: 'app-brand-perception',
  templateUrl: './brand-perception.component.html'
})
export class BrandPerceptionComponent implements OnInit {

  constructor(private discoveryService: DiscoveryService) { }

  private brandPerceptionOverTimeColumns = []

  ngOnInit() {
    this.discoveryService.getBrandPerceptionOverTime().subscribe((response) => {
      this.brandPerceptionOverTimeColumns = response
    })
  }

  ngAfterViewInit() {
    var chart = c3.generate({
      bindto: '#brand-perception-chart',
      legend: {
        show: false
      },
      color: {
          pattern: ['#9855d4']
      },
      data: {
          x: 'Months',
          columns: this.brandPerceptionOverTimeColumns
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
