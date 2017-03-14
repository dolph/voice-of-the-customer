import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var moment:any

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})

export class ProductDetailsComponent implements OnInit {

  private lastUpdated = ''
  private sub: any;
  private productName;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.productName = params['name']; 
    });
  }

  ngAfterViewInit() {
    this.lastUpdated = moment().format('MMMM Do, YYYY')
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
