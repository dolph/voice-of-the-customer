import { Component, OnInit } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

declare var c3:any

@Component({
  selector: 'app-brand-sentiment',
  templateUrl: './brand-sentiment.component.html'
})
export class BrandSentimentComponent implements OnInit {

  private sentimentDescription: string = ''

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getCurrentBrandSentiment('last12months').subscribe((response) => {
      // Find the highest sentiment percentage
      let topIdx = -1
      let topScore = -1
      let i = 0
      for (let sentiment of response) {
        if (sentiment[1] > topScore) {
          topIdx = i
          topScore = sentiment[1]
        }
        i++
      }
      let sentiments = {
        'negative': 'negativaly',
        'positive': 'positivaly',
        'neutral': 'neutrally'
      }
      this.sentimentDescription = topScore + '% of customers are speaking ' + sentiments[response[topIdx][0]] + ' of W Wireless today'
      let title = (topScore + '% ' + response[topIdx][0] + ' Sentiment').replace(/\b\w/g, l => l.toUpperCase())
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
            pattern: ['#dc267f', '#008949', '#dddee1']
        },
        donut: {
            title: title,
            width: 15,
            label: {
              show: false
            }
        },
        size: {
          height: 240
        }
      });
    })
  }

}
