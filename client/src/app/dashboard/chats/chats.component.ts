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

  private negativeMentions = {
    title: 'Products Negatively Mentioned',
    subtitle: 'Percentage of negative mentions of product overall',
    color: '#DC267F',
    sentiment: 'negative',
    source: 'chat',
    data: []
  }

  private positiveMentions = {
    title: 'Products Positively Mentioned',
    subtitle: 'Percentage of positive mentions of product overall',
    color: '#008949',
    sentiment: 'positive',
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
