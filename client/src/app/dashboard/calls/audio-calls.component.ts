import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'

import { DashboardCtxService } from '../shared/dashboard-ctx.service'

@Component({
  selector: 'app-audio-calls',
  templateUrl: './audio-calls.component.html'
})

export class AudioCallsComponent implements OnInit {

  private productMentions = {
    title: 'Products Mentioned',
    subtitle: 'Percentage mentions of products overall',
    color: '#008949',
    source: 'call',
    data: []
  }

  private sentimentMentions = {
    title: 'Percentage Negative Mentions',
    subtitle: 'Percentage the product was negatively mentioned',
    color: '#DC267F',
    sentiment: 'negative',
    source: 'call',
    data: []
  }


  private popularTopics = {
    title: 'Most Popular Topics',
    type: 'topics',
    source: 'call',
    data: []
  }

  constructor(private fromComponentService: FromComponentService, private dashboardCtxService: DashboardCtxService) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/audio-calls')
    this.dashboardCtxService.setTitle('Audio Call Highlights')
  }
}
