import { Component, OnInit } from '@angular/core';

declare var c3:any

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html'
})
export class AllChannelsComponent implements OnInit {

  private showPerceptionAnalysis:boolean = false

  private negativeMentions = {
    title: 'Products Negatively Mentioned',
    subtitle: 'Percentage of negative mentions of product overall',
    color: '#de1f80',
    sentiment: 'negative',
    data: []
  }

  private positiveMentions = {
    title: 'Products Positively Mentioned',
    subtitle: 'Percentage of positive mentions of product overall',
    color: '#36cfbf',
    sentiment: 'positive',
    data: []
  }

  private popularTopics = {
    title: 'Most Popular Topics',
    type: 'topics',
    data: []
  }

  private popularFeatures = {
    title: 'Most Popular Features',
    type: 'features',
    data: []
  }

  constructor() { }

  private openPerceptionAnalysis(data) {
    console.log('in triggerPerceptionAnalysis ' + data)
    this.showPerceptionAnalysis = true
  }

  private closePerceptionAnalysis(data) {
    console.log('in triggerPerceptionAnalysis ' + data)
    this.showPerceptionAnalysis = false
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}
