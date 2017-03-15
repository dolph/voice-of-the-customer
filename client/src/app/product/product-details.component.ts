import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FromComponentService } from '../shared/utils/from-component.service'

declare var moment:any

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})

export class ProductDetailsComponent implements OnInit {

  // To be able to go back to where we came from
  @Input() fromComponent = '/home/dashboard/all-channels';

  private lastUpdated = ''
  private sub: any;
  private product: string;

  constructor(private route: ActivatedRoute, private router: Router, private fromComponentService: FromComponentService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.product = params['name'];
    });
  }

  ngAfterViewInit() {
    this.lastUpdated = moment().format('MMMM Do, YYYY')
  }

  returnToCaller() {
    // console.log(this.fromComponentService.getFrom())
    this.router.navigate([this.fromComponentService.getFrom()]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
