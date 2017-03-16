import { Component, OnInit } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html'
})
export class ForumsComponent implements OnInit {

  private forumVolOverTime = {
    title: 'Volume of posts over time',
    yLabel: 'Number of posts',
    source: 'forum'
  }

  private negativeMentions = {
    title: 'Products Negatively Mentioned',
    subtitle: 'Percentage of negative mentions of product overall',
    color: '#DC267F',
    sentiment: 'negative',
    source: 'forum',
    data: []
  }

  private positiveMentions = {
    title: 'Products Positively Mentioned',
    subtitle: 'Percentage of positive mentions of product overall',
    color: '#008949',
    sentiment: 'positive',
    source: 'forum',
    data: []
  }

  private popularTopics = {
    title: 'Most Popular Topics',
    type: 'topics',
    source: 'forum',
    data: []
  }

  constructor(private fromComponentService: FromComponentService, private dashboardCtxService: DashboardCtxService) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/forums')
    this.dashboardCtxService.setTitle('Forum Highlights')
  }

}
