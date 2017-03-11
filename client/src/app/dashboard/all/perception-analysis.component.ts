import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-perception-analysis',
  templateUrl: './perception-analysis.component.html'
})
export class PerceptionAnalysisComponent implements OnInit {

  @Output() perceptionAnalysisClose = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  private closePerceptionAnalysis() {
    this.perceptionAnalysisClose.emit()
  }

}
