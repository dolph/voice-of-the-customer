import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
