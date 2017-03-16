import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class DashboardCtxService {

  private titleChangeSource = new Subject<string>()
  private dashboardTitle: string = ''

  titleChanged$ = this.titleChangeSource.asObservable();

  constructor() { }

  setTitle(value) {
    this.dashboardTitle = value
    this.titleChangeSource.next(value)
  }

  getTitle() {
    return this.dashboardTitle
  }
}
