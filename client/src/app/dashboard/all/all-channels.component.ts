import { Component, OnInit } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html'
})
export class AllChannelsComponent implements OnInit {

  private showPerceptionAnalysis:boolean = false

  private negativeMentions = {
    title: 'Products Negatively Mentioned',
    subtitle: 'Percentage of negative mentions of product overall',
    color: '#DC267F',
    sentiment: 'negative',
    source: 'all',
    data: []
  }

  private positiveMentions = {
    title: 'Products Positively Mentioned',
    subtitle: 'Percentage of positive mentions of product overall',
    color: '#008949',
    sentiment: 'positive',
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

  constructor(private discoveryService: DiscoveryService) { }

  private openPerceptionAnalysis(data) {
    console.log('in triggerPerceptionAnalysis ' + JSON.stringify(data))
    this.perceptionAnalysisOptions = data
    this.showPerceptionAnalysis = true
  }

  private closePerceptionAnalysis(data) {
    this.showPerceptionAnalysis = false
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}
