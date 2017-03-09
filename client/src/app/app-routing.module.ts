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
import { NgModule }             from '@angular/core';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';

import { AuthGuard } from './auth';
import { LoopbackLoginComponent } from './auth/loopback/lb-login.component';

import { HomeComponent } from './home.component'

import { AllChannelsComponent, AudioCallsComponent, ChatsComponent, ForumsComponent } from './dashboard'

const APP_ROUTES: Routes = [
  { path: 'login', component: LoopbackLoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: 'all-channels', component: AllChannelsComponent },
    { path: 'audio-calls', component: AudioCallsComponent },
    { path: 'forums', component: ForumsComponent },
    { path: 'chats', component: ChatsComponent },
    { path: '', redirectTo: 'all-channels', pathMatch: 'full' },
  ] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: LoopbackLoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
