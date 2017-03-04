import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CarouselModule, DropdownModule, AlertModule } from 'ng2-bootstrap';

import { ChatComponent, NotificationComponent } from './home.component';

@NgModule({
    imports: [CommonModule, CarouselModule, DropdownModule, AlertModule],
    declarations: [HomeComponent, ChatComponent, NotificationComponent],
    exports: [HomeComponent, ChatComponent, NotificationComponent]
})

export class HomeModule { }
