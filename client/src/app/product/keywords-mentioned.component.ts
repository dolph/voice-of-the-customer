import { Component, OnInit, Input } from '@angular/core';

import { DiscoveryService } from '../shared/discovery/discovery.service';

@Component({
  selector: 'app-keywords-mentioned',
  templateUrl: './keywords-mentioned.component.html'
})
export class KeywordsMentionedComponent implements OnInit {

  @Input() product: string
  @Input() options: any = {
    type: '',
    source: ''
  }

  private colors = [ '#35D6BB', '#00BBA1', '#00A88F', '#008773', '#006456']

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.discoveryService.getProductKeywordMentions('last12months', this.product).subscribe((response) => {
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
