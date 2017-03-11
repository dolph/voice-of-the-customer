import { Component, OnInit } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any

@Component({
  selector: 'app-brand-sentiment',
  templateUrl: './brand-sentiment.component.html'
})
export class BrandSentimentComponent implements OnInit {

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getCurrentBrandSentiment('last12months').subscribe((response) => {
      // console.log(JSON.stringify(response))
      var chart = c3.generate({
        bindto: '#brand-sentiment-chart',
        data: {
            columns: response,
            type : 'donut'
        },
        gauge: {
          label: {
            show: false
          }
        },
        legend: {
          show: true
        },
        color: {
            pattern: ['#de1f80', '#dddee1', '#36cfbf']
        },
        donut: {
            title: "68% Negative Sentiment",
            width: 15,
            label: {
              show: false
            }
        },
        size: {
          height: 200
        }
      });
    })

  }

}
