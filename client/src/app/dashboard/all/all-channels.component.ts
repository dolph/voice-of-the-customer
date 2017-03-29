import { Component, OnInit } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';
import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html'
})
export class AllChannelsComponent implements OnInit {

  private showPerceptionAnalysis:boolean = false

  private productMentions = {
    title: 'Products Mentioned',
    subtitle: 'Percentage mentions of products overall',
    color: '#35D6BB',
    source: 'all',
    data: []
  }

  private sentimentMentions = {
    title: 'Percentage Negative Mentions',
    subtitle: 'Percentage the product was negatively mentioned',
    color: '#DC267F',
    sentiment: 'negative',
    source: 'all',
    data: []
  }

  private popularTopics = {
    title: 'Most Popular Topics',
    type: 'topics',
    source: 'all',
    data: []
  }

  private popularFeatures = {
    title: 'Most Popular Features',
    type: 'features',
    source: 'all',
    data: []
  }

  private perceptionAnalysisOptions = {}

  constructor(private discoveryService: DiscoveryService, private fromComponentService: FromComponentService, private dashboardCtxService: DashboardCtxService) { }

  private openPerceptionAnalysis(data) {
    this.perceptionAnalysisOptions = data
    this.showPerceptionAnalysis = true
  }

  private closePerceptionAnalysis(data) {
    this.showPerceptionAnalysis = false
  }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/all-channels')
    this.dashboardCtxService.setTitle('Today\'s Highlights')
  }

  ngAfterViewInit() {
  }
}
