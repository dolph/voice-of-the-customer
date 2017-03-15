import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../shared/discovery/discovery.service';

declare var c3:any

@Component({
  selector: 'app-product-sentiment',
  templateUrl: './product-sentiment.component.html'
})
export class ProductSentimentComponent implements OnInit {

  @Input() product: string
  private sentimentDescription: string = ''

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getProductSentiment('last12months', this.product).subscribe((response) => {
      //console.log(JSON.stringify(response))
      let colors = {
        negative: '#dc267f', positive: '#008949', neutral: '#dddee1'}
      let pattern = []
      // Find the highest sentiment percentage
      let topIdx = -1
      let topScore = -1
      let i = 0
      for (let sentiment of response) {
        pattern.push(colors[sentiment[0]])
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
      this.sentimentDescription = topScore + '% of customers are speaking ' + sentiments[response[topIdx][0]] + ' of ' + this.product
      let title = (topScore + '% ' + response[topIdx][0] + ' Sentiment').replace(/\b\w/g, l => l.toUpperCase())
      // console.log(JSON.stringify(response))
      var chart = c3.generate({
        bindto: '#product-sentiment-chart',
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
            pattern: pattern
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
