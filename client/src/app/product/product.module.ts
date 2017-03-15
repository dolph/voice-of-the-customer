import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DropdownModule } from 'ng2-bootstrap/dropdown';

import { AppRoutingModule } from '../app-routing.module';

import { ProductDetailsComponent} from './product-details.component';
import { ConceptsMentionedComponent } from './concepts-mentioned.component'
import { KeywordsMentionedComponent } from './keywords-mentioned.component'
import { PerceptionOverTimeComponent } from './perception-over-time.component'
import { ProductSentimentComponent } from './product-sentiment.component';

@NgModule({
  declarations: [
    ProductDetailsComponent,
    ConceptsMentionedComponent,
    KeywordsMentionedComponent,
    PerceptionOverTimeComponent,
    ProductSentimentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule.forRoot()
  ],
})
export class ProductModule { }
