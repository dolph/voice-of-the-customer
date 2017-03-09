import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-most-popular',
  templateUrl: './most-popular.component.html'
})
export class MostPopularComponent implements OnInit {

  @Input() options: any

  constructor() { }

  ngOnInit() {
  }

}
