import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-most-popular',
  templateUrl: './most-popular.component.html'
})
export class MostPopularComponent implements OnInit {

  @Input() options: any

  private colors = [ '#35D6BB', '#00BBA1', '#00A88F', '#008773', '#006456']

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getMostPopular(this.options.type, this.options.source, 'last12months').subscribe((response) => {
      // console.log(JSON.stringify(response))
      let i = 0;
      for (let x of response) {
        response[i].color = this.colors[i]
        i++
      }
      this.options.data = response
    })
  }
}
