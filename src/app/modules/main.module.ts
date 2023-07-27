// import { ChatComponent } from './../components/chat/chat.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MaterialModule } from 'src/material.module';
import { SharedModule } from './shared.module';

import { MainComponent } from '../components/main/main.component';
import { MainRoutingModule } from '../routes/main-routing.module';
// import { DashboardModule } from './dashboard.module';
import { AdminModule } from './admin.module';
import { UserModule } from './user.module';
// import { ChatModule } from './chat.module';
// import { ChannelsComponent } from '../components/channels/channels.component';

@NgModule({
  declarations: [
    MainComponent,
    // ChatComponent
    // ChannelsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainRoutingModule,
    SharedModule,
    // DashboardModule,
    // ChatModule,
    UserModule,
    AdminModule,

  ],
  exports: [
    MainRoutingModule,
  ]
})
export class MainModule { }
