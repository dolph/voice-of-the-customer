import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-products-mentioned',
  templateUrl: './products-mentioned.component.html'
})
export class ProductsMentionedComponent implements OnInit {

  @Input() options:any

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getProductMentions('last12months', this.options.sentiment).subscribe((response) => {
      console.log(JSON.stringify(response))
      this.options.data = response
    })
  }
}
