import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-products-mentioned',
  templateUrl: './products-mentioned.component.html'
})
export class ProductsMentionedComponent implements OnInit {

  @Input() options:any

  constructor(private router: Router, private discoveryService: DiscoveryService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getProductMentions('last12months', this.options.source, this.options.sentiment).subscribe((response) => {
      // console.log(JSON.stringify(response))
      this.options.data = response
    })
  }

  routeToProductDetails(name) {
    this.router.navigate(['/home/product/', name])
  }
}
