import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-most-popular',
  templateUrl: './most-popular.component.html'
})
export class MostPopularComponent implements OnInit {

  @Input() options: any

  private colors = [ '#d8a7ff', '#ba8dfb', '#b168ea', '#733c9b', '#562c73']

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getMostPopular(this.options.type, 'last12months').subscribe((response) => {
      console.log(JSON.stringify(response))
      let i = 0;
      for (let x of response) {
        response[i].color = this.colors[i]
        i++
      }
      this.options.data = response
    })
  }
}
