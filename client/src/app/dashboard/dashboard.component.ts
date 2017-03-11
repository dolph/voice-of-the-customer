import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

declare var moment:any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  private lastUpdated = ''

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.lastUpdated = moment().format('MMMM Do, YYYY')
  }
}
