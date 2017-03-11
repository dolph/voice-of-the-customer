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

import { DropdownModule } from 'ng2-bootstrap/dropdown';

import { AllChannelsComponent } from './all/all-channels.component';
import { AudioCallsComponent } from './calls/audio-calls.component';
import { ChatsComponent } from './chats/chats.component';
import { ForumsComponent } from './forums/forums.component';
import { BrandPerceptionComponent } from './all/brand-perception.component';
import { BrandSentimentComponent } from './all/brand-sentiment.component';
import { ProductsMentionedComponent } from './all/products-mentioned.component';
import { MostPopularComponent } from './all/most-popular.component';

import { DiscoveryService } from '../shared/discovery/discovery.service';
import { SampleDataService } from '../shared/discovery/sample-data.service';

import { PerceptionAnalysisComponent } from './all/perception-analysis.component';

@NgModule({
  imports:      [ CommonModule, RouterModule, DropdownModule.forRoot() ],
  declarations: [ AllChannelsComponent, AudioCallsComponent, ChatsComponent, ForumsComponent, BrandPerceptionComponent, BrandSentimentComponent, ProductsMentionedComponent, MostPopularComponent, PerceptionAnalysisComponent ],
  providers: [ DiscoveryService, SampleDataService ]
})

export class DashboardModule {
  constructor() { }
}
