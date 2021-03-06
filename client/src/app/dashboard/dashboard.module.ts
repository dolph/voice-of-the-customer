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
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AllChannelsComponent } from './all/all-channels.component';
import { AudioCallsComponent } from './calls/audio-calls.component';
import { ChatsComponent } from './chats/chats.component';
import { ForumsComponent } from './forums/forums.component';
import { BrandPerceptionComponent } from './all/brand-perception.component';
import { BrandSentimentComponent } from './all/brand-sentiment.component';
import { ProductsMentionedComponent } from './shared/products-mentioned.component';
import { MostPopularComponent } from './shared/most-popular.component';

import { DiscoveryService } from '../shared/discovery/discovery.service';
import { SampleDataService } from '../shared/discovery/sample-data.service';

import { PerceptionAnalysisComponent } from './all/perception-analysis.component';
import { VolCallsOverTimeComponent } from './calls/vol-calls-over-time.component';
import { LengthOfCallsComponent } from './calls/length-of-calls.component';
import { ChannelVolOvertimeComponent } from './shared/channel-vol-overtime.component';

import { DashboardCtxService } from './shared/dashboard-ctx.service';
import { MostPopularSmallComponent } from './shared/most-popular-small.component';
import { MentionedSentimentComponent } from './shared/mentioned-sentiment.component'

@NgModule({
  imports:      [ CommonModule,
    RouterModule,
    BsDropdownModule.forRoot() ],
  declarations: [ AllChannelsComponent,
    AudioCallsComponent,
    ChatsComponent,
    ForumsComponent,
    BrandPerceptionComponent,
    BrandSentimentComponent,
    ProductsMentionedComponent,
    MostPopularComponent,
    PerceptionAnalysisComponent,
    VolCallsOverTimeComponent,
    LengthOfCallsComponent,
    ChannelVolOvertimeComponent,
    MostPopularSmallComponent,
    MentionedSentimentComponent ],
  providers: [ DiscoveryService,
    SampleDataService,
    DashboardCtxService ]
})

export class DashboardModule {
  constructor() { }
}
