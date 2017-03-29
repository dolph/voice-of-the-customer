import { Component, OnInit } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html'
})
export class ChatsComponent implements OnInit {

  private chatVolOverTime = {
    title: 'Volume of chats over time',
    yLabel: 'Number of chats',
    source: 'chat'
  }

  private productMentions = {
    title: 'Products Mentioned',
    subtitle: 'Percentage mentions of products overall',
    color: '#35D6BB',
    source: 'chat',
    data: []
  }

  private sentimentMentions = {
    title: 'Percentage Negative Mentions',
    subtitle: 'Percentage the product was negatively mentioned',
    color: '#DC267F',
    sentiment: 'negative',
    source: 'chat',
    data: []
  }

  private popularTopics = {
    title: 'Most Popular Topics',
    type: 'topics',
    source: 'chat',
    data: []
  }

  constructor(private fromComponentService: FromComponentService, private dashboardCtxService: DashboardCtxService) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/chats')
    this.dashboardCtxService.setTitle('Chat Highlights')
  }

}
