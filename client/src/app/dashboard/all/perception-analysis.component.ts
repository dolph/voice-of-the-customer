import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-perception-analysis',
  templateUrl: './perception-analysis.component.html'
})
export class PerceptionAnalysisComponent implements OnInit {

  @Input() options
  @Output() perceptionAnalysisClose = new EventEmitter<any>();

  private perceptionAnalysisData = {
    title: 'Change in positive perception',
    direction: 'perception-down-arrow',
    directionColor: '#dc267f',
    changePercentage: 0,
    changeText: '',
    fromPercentage: 0,
    fromText: '',
    toPercentage: 0,
    toText: ''
  }

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
    this.discoveryService.getPerceptionAnalysis(this.options.x).subscribe((analysis) => {
      this.perceptionAnalysisData.changePercentage = analysis.changePercentage
      this.perceptionAnalysisData.changeText = analysis.changeText
      this.perceptionAnalysisData.fromPercentage = analysis.fromPercentage
      this.perceptionAnalysisData.fromText = 'positive sentiment ' + analysis.from
      this.perceptionAnalysisData.toPercentage = analysis.toPercentage
      this.perceptionAnalysisData.toText = 'positive sentiment ' + analysis.to
    })
  }

  private closePerceptionAnalysis() {
    this.perceptionAnalysisClose.emit()
  }

}
