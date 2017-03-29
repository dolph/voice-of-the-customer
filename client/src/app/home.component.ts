/*
# Copyright 2016 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
# limitations under the License.
*/
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { LoopbackLoginService } from './auth/loopback';

import { NavbarComponent } from './shared'
import { DashboardComponent } from './dashboard'

@Component({
  selector: 'app-home',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class HomeComponent {

  private sub: any;
  constructor(private authService: LoopbackLoginService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // subscribe to router event
    this.sub = this.activatedRoute.queryParams.subscribe((params: Params) => {
      let originalUrl = params['originalUrl'];
      if (originalUrl) {
        // console.log('Redirecting to : ' + originalUrl)
        this.router.navigateByUrl(originalUrl);
      }
    });
  }

  submitLogout() {
    this.authService.logout().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
