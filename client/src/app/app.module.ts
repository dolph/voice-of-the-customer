import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

import { AuthModule, AuthGuard } from './auth';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

import { DashboardModule, DashboardComponent } from './dashboard';

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
    DashboardModule
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, AuthGuard],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
