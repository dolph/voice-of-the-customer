import { Component, OnInit } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'

@Component({
  selector: 'app-audio-calls',
  templateUrl: './audio-calls.component.html'
})
export class AudioCallsComponent implements OnInit {

  private negativeMentions = {
    title: 'Products Negatively Mentioned',
    subtitle: 'Percentage of negative mentions of product overall',
    color: '#DC267F',
    sentiment: 'negative',
    source: 'call',
    data: []
  }

  private positiveMentions = {
    title: 'Products Positively Mentioned',
    subtitle: 'Percentage of positive mentions of product overall',
    color: '#008949',
    sentiment: 'positive',
    source: 'call',
    data: []
  }

  private popularTopics = {
    title: 'Most Popular Topics',
    type: 'topics',
    source: 'call',
    data: []
  }

  constructor(private fromComponentService: FromComponentService) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/audio-calls')
  }

}
