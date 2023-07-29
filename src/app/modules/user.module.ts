import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {MatProgressBarModule} from '@angular/material/progress-bar';

import { SharedModule } from './shared.module';

// import { AdminRoutingModule } from '../routes/admin-routing.module';

// import { MatTooltipModule } from '@angular/material/tooltip';
// import { NgxPaginationModule } from 'ngx-pagination';
import { ChannelsComponent } from '../components/channels/channels.component';
import { UserRoutingModule } from '../routes/user-routing.module';
import { DashboardModule } from './dashboard.module';
import { UserComponent } from '../components/user/user.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
// import { RemoveMillisecondsPipe } from '../directives/remove-milliseconds.pipe';

@NgModule({
  declarations: [
    ChannelsComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTooltipModule,
    DashboardModule,
    UserRoutingModule,
    SharedModule,
    NgxUiLoaderModule
    // NgxPaginationModule,
    // MatProgressBarModule,
    // MaterialModule
  ]
})
export class UserModule { }
