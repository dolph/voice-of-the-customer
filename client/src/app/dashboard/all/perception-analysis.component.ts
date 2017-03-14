import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChange } from '@angular/core';

import { DiscoveryService } from '../../shared/discovery/discovery.service';

@Component({
  selector: 'app-perception-analysis',
  templateUrl: './perception-analysis.component.html'
})
export class PerceptionAnalysisComponent implements OnInit, OnChanges {

  @Input() options
  @Output() perceptionAnalysisClose = new EventEmitter<any>();
  private arrowType = 'fa-arrow-down'
  private directionColors = {
    none: '#000000',
    up: '#36cfbf',
    down: '#dc267f'
  }

  private perceptionAnalysisData = {
    title: 'Change in positive perception',
    direction: 'none',
    changePercentage: 0,
    changeText: '',
    fromPercentage: 0,
    fromText: '',
    toPercentage: 0,
    toText: ''
  }

  constructor(private discoveryService: DiscoveryService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    let changedProp = changes['options'];
    let to = JSON.stringify(changedProp.currentValue);
    this.options = JSON.parse(to)
    this.loadPerceptionAnalysisData()
  }

  private loadPerceptionAnalysisData() {
    this.discoveryService.getPerceptionAnalysis(this.options.x).subscribe((analysis) => {
      this.arrowType = 'fa-arrow-' + analysis.direction
      this.perceptionAnalysisData.direction = analysis.direction
      this.perceptionAnalysisData.changePercentage = analysis.changePercentage
      this.perceptionAnalysisData.changeText = analysis.changeText
      this.perceptionAnalysisData.fromPercentage = analysis.fromPercentage
      this.perceptionAnalysisData.fromText = 'positive sentiment ' + analysis.from
      this.perceptionAnalysisData.toPercentage = analysis.toPercentage
      this.perceptionAnalysisData.toText = 'positive sentiment ' + analysis.to
    })
  }

  private getDirectionColor() {
    let color = this.directionColors[this.perceptionAnalysisData.direction]
    return color
  }

  private closePerceptionAnalysis() {
    this.perceptionAnalysisClose.emit()
  }

}
