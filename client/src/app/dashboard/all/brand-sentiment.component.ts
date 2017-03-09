import { Component, OnInit } from '@angular/core';

declare var c3:any

@Component({
  selector: 'app-brand-sentiment',
  templateUrl: './brand-sentiment.component.html'
})
export class BrandSentimentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var chart = c3.generate({
      bindto: '#brand-sentiment-chart',
      data: {
          columns: [
              ['Negative', 68],
              ['Neutral', 5],
              ['Positive', 27]
          ],
          type : 'donut'
      },
      gauge: {
        label: {
          show: false
        }
      },
      legend: {
        show: false
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
  }
}
