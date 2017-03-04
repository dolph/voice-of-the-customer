import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { DashboardModule } from './dashboard/dashboard.module'
import { SharedModule } from './shared/shared.module';
import { ChartModule } from './dashboard/charts/chart.module'


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    SharedModule.forRoot(),
    ChartModule
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
