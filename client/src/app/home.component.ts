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
import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LoopbackLoginService } from './auth/loopback/lb-login.service';

@Component({
  selector: 'app-home',
  templateUrl: `
    <h2 class="base--h2">This is the Home Page</h2>
    <button class="base--button" (click)="submitLogout()">Logout</button>
  `,
})
@Injectable()
export class HomeComponent implements OnInit {

  constructor(private router: Router, private authService: LoopbackLoginService) { }

  ngOnInit() {
  }

  submitLogout() {
    this.authService.logout().subscribe();
  }

}
