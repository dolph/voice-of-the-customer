import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DashboardCtxService } from './shared/dashboard-ctx.service'

declare var moment:any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  private titleSubject
  private title
  private lastUpdated = moment().format('MMMM Do, YYYY')

  constructor(private router: Router, private dashboardCtxService: DashboardCtxService) { }

  ngOnInit() {
    this.titleSubject = this.dashboardCtxService.titleChanged$.subscribe((title) => this.title = title)
  }

  ngAfterViewInit() {
    this.lastUpdated = moment().format('MMMM Do, YYYY')
  }

  routeToTab(tab) {
    switch (tab) {
      case 'all':
        this.title = 'Today\'s Highlights'
        //this.router.navigate(['home/dashboard/all-channels'])
        break
      case 'audio-calls':
        this.title = 'Audio Call Highlights'
        //this.router.navigate(['home/dashboard/audio-calls'])
        break
      case 'chats':
        this.title = 'Chat Highlights'
        //this.router.navigate(['home/dashboard/chats'])
        break
      case 'forums':
        this.title = 'Forum Highlights'
        //this.router.navigate(['home/dashboard/forums'])
        break
    }
  }

  ngOnDestroy() {
    this.titleSubject.unsubscribe()
  }
}
