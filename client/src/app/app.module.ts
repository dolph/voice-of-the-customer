import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AuthModule, AuthGuard } from './auth';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

import { DashboardModule, DashboardComponent } from './dashboard';
import { ProductModule } from './product/product.module';

import { FromComponentService } from './shared/utils/from-component.service'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    ProductModule,
    BsDropdownModule.forRoot()
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, AuthGuard, FromComponentService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
