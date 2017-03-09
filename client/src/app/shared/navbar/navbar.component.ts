import { Component, OnInit } from '@angular/core';

import { LoopbackLoginService } from '../../auth/loopback'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private authService:LoopbackLoginService) { }

  ngOnInit() {
  }

  private logout() {
    this.authService.logout().subscribe()
  }
}
