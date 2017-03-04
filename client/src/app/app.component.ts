import { Component, ViewContainerRef  } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: `<router-outlet></router-outlet>`
})

export class AppComponent {

  title = 'Watson Solutions Lab';

  public constructor(private viewContainerRef:ViewContainerRef, private titleService: Title) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
    this.titleService.setTitle( this.title );
  }

}
