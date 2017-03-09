import { Component, ViewContainerRef  } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: `
    <router-outlet></router-outlet>
  `
})

export class AppComponent {

  title = 'Voice of the Customer';

  public constructor(private titleService: Title) {
    this.titleService.setTitle( this.title );
  }

}
