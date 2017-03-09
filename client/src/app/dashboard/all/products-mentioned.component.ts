import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-products-mentioned',
  templateUrl: './products-mentioned.component.html'
})
export class ProductsMentionedComponent implements OnInit {

  @Input() options:any

  constructor() { }

  ngOnInit() {
  }

}
