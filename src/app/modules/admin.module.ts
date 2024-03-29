import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {MatProgressBarModule} from '@angular/material/progress-bar';

import { SharedModule } from './shared.module';

import { AdminRoutingModule } from '../routes/admin-routing.module';

import { AdminPostsComponent } from '../components/admin/posts/posts.component';
import { AdminChannelsComponent } from '../components/admin/channels/channels.component';
import { AdminUsersComponent } from '../components/admin/users/users.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminLoginMediaComponent } from '../components/admin/login-media/login-media.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  declarations: [
    AdminPostsComponent,
    AdminChannelsComponent,
    AdminUsersComponent,
    AdminLoginMediaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    AdminRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgxUiLoaderModule
    // MatProgressBarModule,
    // MaterialModule
  ]
})
export class AdminModule { }
