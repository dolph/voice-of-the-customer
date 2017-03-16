import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-mentioned-sentiment',
  templateUrl: './mentioned-sentiment.component.html'
})
export class MentionedSentimentComponent implements OnInit {

  @Input() options:any

  constructor(private router: Router, private discoveryService: DiscoveryService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getProductMentionsSentiment('last12months', this.options.source, 'negative').subscribe((response) => {
      console.log(JSON.stringify(response))
      this.options.data = response
    })
  }

  routeToProductDetails(name) {
    this.router.navigate(['/home/product/', name])
  }
}
